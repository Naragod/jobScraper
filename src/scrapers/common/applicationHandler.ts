import { saveJobInfo } from "../../database/main";
import { writeFileSync } from "fs";
import { classifyJobs } from "../../classifiers/main";
import { closeBrowser } from "./playwrightBrowserSupport";
import { AllJobsLinksGetterFn, IJobInfo, JobInfoGetterFn } from "../common/interfaces";
import { handleJobApplication, handleJobApplicationsInParallel } from "../common/executionSupport";
import { removeExcessArrayItems } from "../../utils/parser";
import { executeInParallel } from "./nativeExecutionSupport";
import { consumeMessages, getChannel, sendMessageToQueue } from "../../queue/main";
import { getNativeNodeList } from "../../utils/nativeHtmlTraversal";

export class JobBoard {
  public name: string;
  public formatters: any;
  public jobLinksQueue: string;
  public getJobInformation: JobInfoGetterFn;
  public getAllJobPageLinks: AllJobsLinksGetterFn;

  constructor(name: string, functions: any, formatters: any, options: any = {}) {
    this.name = name;
    this.formatters = formatters;
    this.jobLinksQueue = options.jobLinksQueue || "jobLinks";
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
      await saveJobInfo([result], formatters, name);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  public async queueJobUrls(searchParams: any, applicationLimit = 100) {
    let applicationPage = 0;
    let applicationsViewed = 0;
    const channel = await getChannel();
    const { getAllJobPageLinks, jobLinksQueue } = this.jobBoard;

    while (applicationsViewed <= applicationLimit) {
      applicationPage += 1;
      searchParams["page"] = applicationPage;
      let jobLinks = await getAllJobPageLinks(searchParams);

      if (jobLinks.length == 0) break;
      applicationsViewed += jobLinks.length;
      jobLinks = removeExcessArrayItems(jobLinks, applicationsViewed, applicationLimit);
      await Promise.allSettled(jobLinks.map((link) => sendMessageToQueue(channel, jobLinksQueue, { link })));
    }
  }

  public async parseJobLinks() {
    const channel = await getChannel();
    const { jobLinksQueue, getJobInformation, formatters, name: JobBoardName } = this.jobBoard;

    await consumeMessages(channel, jobLinksQueue, async (message: any) => {
      const { link } = JSON.parse(message.content.toString());
      const html = await getNativeNodeList(link, "*");
      const result = <any>getJobInformation(link, <any>html);

      if (result == null) return;
      await saveJobInfo([result], formatters, JobBoardName);
    });
  }

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
      const { getJobInformation, getAllJobPageLinks, formatters, name: JobBoardName } = this.jobBoard;

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
        await saveJobInfo(result, formatters, JobBoardName);

        if (jobsToRetry.length == 0) continue;
        writeFileSync(jobToRetryFileName, JSON.stringify(jobsToRetry));
      }

      return jobsInformation;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  public async scrapeJobs(searchParams: any, applicationLimit = 100, executionOptions: any = {}): Promise<IJobInfo[]> {
    try {
      let applicationPage = 0;
      let applicationsViewed = 0;
      const now = new Date().toISOString();
      let jobsInformation: IJobInfo[] = [];
      const { getJobInformation, getAllJobPageLinks, formatters, name: JobBoardName } = this.jobBoard;

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
        // await saveJobInfo(result, formatters, JobBoardName);

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
