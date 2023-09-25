import { timeElapsed } from "../../utils";
import { closeBrowser } from "../common/browserSupport";
import { writeToFile } from "../../emailer/fileHandler";
import { getJobInformation } from "./applicationHandler";
import { getAllJobPageLinks } from "../../apiRequests/canadaJobBank/requestHandler";
import { handleJobApplicationsInParallel } from "../common/executionSupport";
import { IJobInfo, scrapeJobsFn } from "../common/interfaces";
import { classifyJobs } from "../../classifiers/main";

export const scrapeJobs: scrapeJobsFn = async (seachParams: any, applicationLimit = 100) => {
  let applicationPage = 0;
  let applicationsViewed = 0;
  const now = new Date().toISOString();
  let jobsInformation: IJobInfo[] = [];

  while (applicationsViewed < applicationLimit) {
    applicationPage += 1;
    const jobLinks = await getAllJobPageLinks(seachParams);
    const { result } = await timeElapsed<IJobInfo>(handleJobApplicationsInParallel, jobLinks, getJobInformation);
    jobsInformation = jobsInformation.concat(result);
    applicationsViewed += jobLinks.length;
    console.log("applicationsViewed:", applicationsViewed);
    writeToFile(`job_data_${applicationPage}_${now}.json`, JSON.stringify(result));
  }

  await closeBrowser();
  return jobsInformation;
};

export const matchJobs = (jobs: IJobInfo[], skills: string[]) => classifyJobs(jobs, skills);

// take a look at this job posting.
// can increase the number of information captured.
// https://www.jobbank.gc.ca/jobsearch/jobposting/39094276;jsessionid=D05641B8C2280F1AF4ED26414D6DC909.jobsearch74?source=searchresults
// const link = "https://www.jobbank.gc.ca/jobsearch/jobposting/39124644?source=searchresults";
// const result = await getJobInformation(link, page);
