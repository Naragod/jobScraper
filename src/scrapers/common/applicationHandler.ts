import { saveJobInfo } from "../../database/main";
import { writeFileSync } from "fs";
import { classifyJobs } from "../../classifiers/main";
import { closeBrowser } from "../common/browserSupport";
import { AllJobsLinksGetterFn, IJobInfo, JobInfoGetterFn } from "../common/interfaces";
import { handleJobApplication, handleJobApplicationsInParallel } from "../common/executionSupport";

export class JobBoard {
  public name: string;
  public formatters: any;
  public getJobInformation: JobInfoGetterFn;
  public getAllJobPageLinks: AllJobsLinksGetterFn;

  constructor(name: string, functions: any, formatters: any) {
    this.name = name;
    this.formatters = formatters;
    this.getJobInformation = functions["getJobInformation"];
    this.getAllJobPageLinks = functions["getAllJobPageLinks"];
  }
}

export class Scraper {
  constructor(private jobBoard: JobBoard) {
    this.jobBoard = jobBoard;
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
        await saveJobInfo(result, formatters, JobBoardName);

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
