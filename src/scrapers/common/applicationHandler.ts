import { saveJobInfo } from "../../database/main";
import { classifyJobs } from "../../classifiers/main";
import { writeToFile } from "../../emailer/fileHandler";
import { closeBrowser } from "../common/browserSupport";
import { handleJobApplicationsInParallel } from "../common/executionSupport";
import { AllJobsLinksGetterFn, IJobInfo, JobInfoGetterFn } from "../common/interfaces";

export class JobBoard {
  public name: string;
  public getJobInformation: JobInfoGetterFn;
  public getAllJobPageLinks: AllJobsLinksGetterFn;

  constructor(name: string, functions: any) {
    this.name = name;
    this.getJobInformation = functions["getJobInformation"];
    this.getAllJobPageLinks = functions["getAllJobPageLinks"];
  }
}

export class Scraper {
  constructor(private jobBoard: JobBoard) {
    this.jobBoard = jobBoard;
  }

  public async scrapeJobs(searchParams: any, applicationLimit = 100): Promise<IJobInfo[]> {
    try {
      let applicationPage = 0;
      let applicationsViewed = 0;
      const now = new Date().toISOString();
      let jobsInformation: IJobInfo[] = [];
      const { getJobInformation, getAllJobPageLinks } = this.jobBoard;

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
        const { result, jobsToRetry } = await handleJobApplicationsInParallel(jobLinks, getJobInformation);
        jobsInformation = jobsInformation.concat(result);
        applicationsViewed += jobLinks.length;
        console.log("applicationsViewed:", applicationsViewed);
        await saveJobInfo(result);

        if (jobsToRetry.length == 0) continue;
        writeToFile(`${searchParams.searchTerm}_${applicationPage}_${now}.json`, JSON.stringify(jobsToRetry));
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
