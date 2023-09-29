import { closeBrowser } from "../common/browserSupport";
import { writeToFile } from "../../emailer/fileHandler";
import { getJobInformation } from "./applicationHandler";
import { getAllJobPageLinks } from "../../apiRequests/canadaJobBank/requestHandler";
import { handleJobApplicationsInParallel } from "../common/executionSupport";
import { IJobInfo, scrapeJobsFn } from "../common/interfaces";
import { classifyJobs } from "../../classifiers/main";

export const scrapeJobs: scrapeJobsFn = async (searchParams: any, applicationLimit = 100) => {
  let applicationPage = 0;
  let applicationsViewed = 0;
  const now = new Date().toISOString();
  let jobsInformation: IJobInfo[] = [];

  while (applicationsViewed < applicationLimit) {
    applicationPage += 1;
    const jobLinks = await getAllJobPageLinks(searchParams);

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
    writeToFile(`${searchParams.searchTerm}_${applicationPage}_${now}.json`, JSON.stringify(jobsToRetry));
  }

  await closeBrowser();
  return jobsInformation;
};

export const matchJobs = (jobs: IJobInfo[], skills: string[]) => classifyJobs(jobs, skills);
