import { IJobInfo, scrapeJobsFn } from "../common/interfaces";
import { writeToFile } from "../../emailer/fileHandler";
import { closeBrowser } from "../common/browserSupport";
import { handleJobApplicationsInParallel } from "../common/executionSupport";
import { getAllJobPageLinks } from "../../apiRequests/linkedIn/requestHandler";
import { getJobInformation } from "./applicationHandler";
import { saveJobInfo } from "../../database/main";

export const scrapeJobs: scrapeJobsFn = async (searchParams: any, applicationLimit = 10) => {
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
    await saveJobInfo(jobsInformation);
    
    if(jobsToRetry.length == 0) continue;
    writeToFile(`${searchParams.searchTerm}_${applicationPage}_${now}.json`, JSON.stringify(jobsToRetry));
  }
  await closeBrowser();
  return jobsInformation;
};
