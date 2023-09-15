import { timeElapsed } from "../../utils";
import { writeToFile } from "../../emailer/fileHandler";
import { closeBrowser } from "../browserSupport";
import { getAllJobPageLinks } from "../../apiRequests/canadaJobBank/requestHandler";
import { handleJobApplicationsInParallel } from "./applicationHandler";

const DEFAULT_JOB_AGE = 7;

export const applyToJobs = async (jobTitle?: string, location?: string, applicationLimit = 1000) => {
  let applicationsViewed = 0;
  const now = new Date().toISOString();

  for (let applicationPage = 1; applicationPage <= applicationLimit; applicationPage++) {
    if (applicationsViewed >= applicationLimit) break;
    const jobLinks = await getAllJobPageLinks(jobTitle, location, DEFAULT_JOB_AGE, applicationPage);
    const result = await timeElapsed(handleJobApplicationsInParallel, jobLinks);
    applicationsViewed += jobLinks.length;
    console.log("applicationsViewed:", applicationsViewed);
    writeToFile(`job_data_${applicationPage}_${now}.json`, JSON.stringify(result));
  }
  await closeBrowser();
};
