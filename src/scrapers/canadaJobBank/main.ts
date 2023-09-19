import { timeElapsed } from "../../utils";
import { closeBrowser } from "../common/browserSupport";
import { writeToFile } from "../../emailer/fileHandler";
import { getJobInformation } from "./applicationHandler";
import { getAllJobPageLinks } from "../../apiRequests/canadaJobBank/requestHandler";
import { handleJobApplicationsInParallel } from "../common/executionSupport";
import { ApplyToJobsFn } from "../common/interfaces";

export const applyToJobs: ApplyToJobsFn = async (seachParams: any, applicationLimit = 100) => {
  let applicationPage = 0;
  let applicationsViewed = 0;
  const now = new Date().toISOString();

  while (applicationsViewed < applicationLimit) {
    applicationPage += 1;
    const jobLinks = await getAllJobPageLinks(seachParams);
    const { result } = await timeElapsed(handleJobApplicationsInParallel, jobLinks, getJobInformation);
    applicationsViewed += jobLinks.length;
    console.log("applicationsViewed:", applicationsViewed);
    writeToFile(`job_data_${applicationPage}_${now}.json`, JSON.stringify(result));
  }
  await closeBrowser();
};

// take a look at this job posting.
// can increase the number of information captured.
// https://www.jobbank.gc.ca/jobsearch/jobposting/39094276;jsessionid=D05641B8C2280F1AF4ED26414D6DC909.jobsearch74?source=searchresults
// const link = "https://www.jobbank.gc.ca/jobsearch/jobposting/39124644?source=searchresults";
// const result = await getJobInformation(link, page);
