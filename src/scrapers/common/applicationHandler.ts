import dotenv from "dotenv";
import { writeFileSync } from "fs";
import { classifyJobs } from "../../classifiers/main";
import { closeBrowser } from "./playwrightBrowserSupport";
import { saveJobInfo, saveJobsInfo } from "../../database/main";
import { AllJobsLinksGetterFn, IJobInfo, JobInfoGetterFn } from "../common/interfaces";
import { handleJobApplication, handleJobApplicationsInParallel } from "../common/executionSupport";
import { removeExcessArrayItems } from "../../utils/parser";
import { executeInParallel } from "./nativeExecutionSupport";
import { consumeMessageFromQueue, getChannel, sendMessageToQueue } from "../../queue/main";
import { getNativeNodeList } from "../../utils/nativeHtmlTraversal";
import { sleep } from "../../utils/main";
import { queueJobLinks } from "../../queue/jobLinkImplementation";

dotenv.config({ path: `.env.${process.env.ENVIRONMENT}` });

export class JobBoard {
  public name: string;
  public formatters: any;
  public throttleSpeed: number;
  public jobLinksQueue: string;
  public getJobInformation: JobInfoGetterFn;
  public getAllJobPageLinks: AllJobsLinksGetterFn;

  constructor(name: string, functions: any, formatters: any, options: any) {
    this.name = name;
    this.formatters = formatters;
    this.jobLinksQueue = options.jobLinksQueue;
    this.throttleSpeed = options.throttleSpeed || 0;
    this.getJobInformation = functions["getJobInformation"];
    this.getAllJobPageLinks = functions["getAllJobPageLinks"];
  }
}

export class Scraper {
  public channel: any;
  constructor(private jobBoard: JobBoard) {
    this.jobBoard = jobBoard;
  }

  public async getChannel() {
    if (this.channel == undefined) this.channel = await getChannel();
    return this.channel;
  }

  public async scrapeSinglePage(link: string, executionOptions: any = {}) {
    try {
      const { getJobInformation, formatters, name } = this.jobBoard;
      const result = await handleJobApplication(link, getJobInformation, executionOptions);

      if (result.err) return;
      await saveJobInfo(result, formatters, name);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  // uses linkeDom. Much faster than original implementation as now multiple consumers can parse the information.
  public async queueJobUrls(searchParams: any, applicationLimit = 100) {
    let applicationPage = 0;
    let applicationsViewed = 0;
    const { getAllJobPageLinks, jobLinksQueue, name: jobBoardName } = this.jobBoard;

    while (applicationsViewed < applicationLimit) {
      applicationPage += 1;
      searchParams["page"] = applicationPage;
      let jobLinks = await getAllJobPageLinks(searchParams);

      if (jobLinks.length == 0) break;
      jobLinks = removeExcessArrayItems(jobLinks, applicationsViewed, applicationLimit);
      await queueJobLinks(jobLinksQueue, jobBoardName, jobLinks);
      applicationsViewed += jobLinks.length;
    }
  }

  // uses linkeDom. Much faster than original implementation as now multiple consumers can parse the information.
  public async parseJobLinks() {
    const { jobLinksQueue, getJobInformation, formatters, name: jobBoardName, throttleSpeed } = this.jobBoard;
    const channel = await getChannel();
    // assign a single task to a worker. If this is removed, all tasks will be assigned to the same worker
    channel.prefetch(1);

    consumeMessageFromQueue(channel, jobLinksQueue, async (message: any) => {
      const { link, jobBoardName: jbName } = JSON.parse(message.content.toString());

      if (jbName != jobBoardName) throw new Error(`Link: ${link} incompatible with parser: ${jobBoardName}`);
      const html = await getNativeNodeList(link, "*", <any>process.env.USE_PROXY);
      const result = <any>getJobInformation(link, <any>html);
      await sleep(throttleSpeed);

      if (result == null) return;
      await saveJobInfo(result, formatters, jobBoardName);
    }).catch((_err) => console.log(`Consumer error on queue: ${jobLinksQueue}`));
  }

  // uses linkeDom. Super fast. A few limitations.
  public async scrapeJobsNatively(
    searchParams: any,
    applicationLimit = 100,
    executionOptions: any = {},
  ): Promise<IJobInfo[]> {
    try {
      let applicationPage = 0;
      let applicationsViewed = 0;
      const now = new Date().toISOString();
      let jobsInformation: IJobInfo[] = [];
      const { getJobInformation, getAllJobPageLinks, formatters, name: jobBoardName } = this.jobBoard;

      while (applicationsViewed < applicationLimit) {
        applicationPage += 1;
        searchParams["page"] = applicationPage;
        let jobLinks = await getAllJobPageLinks(searchParams);
        const jobToRetryFileName = `./jobs_to_retry/${searchParams.searchTerm}_${applicationPage}_${now}.json`;

        if (jobLinks.length == 0) break;
        jobLinks = removeExcessArrayItems(jobLinks, applicationsViewed, applicationLimit);
        const { result, jobsToRetry } = await executeInParallel(jobLinks, getJobInformation, executionOptions);
        jobsInformation = jobsInformation.concat(result);

        applicationsViewed += jobLinks.length;
        console.log("applicationsViewed:", applicationsViewed);
        await saveJobsInfo(result, formatters, jobBoardName);

        if (jobsToRetry.length == 0) continue;
        writeFileSync(jobToRetryFileName, JSON.stringify(jobsToRetry));
      }

      return jobsInformation;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  // uses playwright
  public async scrapeJobs(searchParams: any, applicationLimit = 100, executionOptions: any = {}): Promise<IJobInfo[]> {
    try {
      let applicationPage = 0;
      let applicationsViewed = 0;
      const now = new Date().toISOString();
      let jobsInformation: IJobInfo[] = [];
      const { getJobInformation, getAllJobPageLinks, formatters, name: jobBoardName } = this.jobBoard;

      while (applicationsViewed < applicationLimit) {
        applicationPage += 1;
        const jobLinks = await getAllJobPageLinks(searchParams);

        if (jobLinks.length == 0) break;

        // if there are more applications to be viewed than the application limit set, remove the excess
        if (applicationsViewed + jobLinks.length > applicationLimit) {
          const keep = applicationLimit - applicationsViewed;
          const remove = jobLinks.length - keep;
          jobLinks.splice(keep, remove);
        }
        const { result, jobsToRetry } = await handleJobApplicationsInParallel(
          jobLinks,
          getJobInformation,
          executionOptions,
        );
        jobsInformation = jobsInformation.concat(result);
        applicationsViewed += jobLinks.length;
        console.log("applicationsViewed:", applicationsViewed);
        await saveJobsInfo(result, formatters, jobBoardName);

        if (jobsToRetry.length == 0) continue;
        writeFileSync(
          `./jobs_to_retry/${searchParams.searchTerm}_${applicationPage}_${now}.json`,
          JSON.stringify(jobsToRetry),
        );
      }

      await closeBrowser();
      return jobsInformation;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  matchJobs(jobs: IJobInfo[], skills: string[]) {
    return classifyJobs(jobs, skills);
  }
}
