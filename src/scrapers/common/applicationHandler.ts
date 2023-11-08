import dotenv from "dotenv";
import { writeFileSync } from "fs";
import { classifyJobs } from "../../classifiers/main";
import { closeBrowser } from "./playwrightBrowserSupport";
import { saveJobInfo, saveJobsInfo } from "../../storage/database/main";
import { AllJobsLinksGetterFn, IJobInfo, JobInfoGetterFn } from "../common/interfaces";
import { handleJobApplication, handleJobApplicationsInParallel } from "../common/executionSupport";
import { removeExcessArrayItems } from "../../utils/parser";
import { executeInParallel } from "./nativeExecutionSupport";
import { getChannel } from "../../storage/queue/main";
import { parseJobLinksFromQueue, queueJobLinks } from "../../storage/queue/jobLinkImplementation";

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

  public getName() {
    return this.jobBoard.name;
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
  public async parseJobLinks(options: any) {
    const { numOfWorkers = 1 } = options;

    for (let i = 0; i < numOfWorkers; i++) {
      const observable = await parseJobLinksFromQueue(this.jobBoard);
      observable.subscribe((value) => console.log(`__ message consumed on: ${value.consumerTag}__`));
    }
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
      // const now = new Date().toISOString();
      let jobsInformation: IJobInfo[] = [];
      const { getJobInformation, getAllJobPageLinks, formatters, name: jobBoardName } = this.jobBoard;
      console.log(`Scraping using: ${jobBoardName}`);

      while (applicationsViewed < applicationLimit) {
        applicationPage += 1;
        searchParams["page"] = applicationPage;
        let jobLinks = await getAllJobPageLinks(searchParams);
        // const jobToRetryFileName = `./jobs_to_retry/${searchParams.searchTerm}_${applicationPage}_${now}.json`;

        if (jobLinks.length == 0) break;
        jobLinks = removeExcessArrayItems(jobLinks, applicationsViewed, applicationLimit);
        const { result, jobsToRetry } = await executeInParallel(jobLinks, getJobInformation, executionOptions);
        jobsInformation = jobsInformation.concat(result);

        applicationsViewed += jobLinks.length;
        console.log("applicationsViewed:", applicationsViewed);
        await saveJobsInfo(result, formatters, jobBoardName);

        if (jobsToRetry.length == 0) continue;
        // writeFileSync(jobToRetryFileName, JSON.stringify(jobsToRetry));
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
