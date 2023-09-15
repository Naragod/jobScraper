import { timeElapsed } from "../../utils";
import { ApplyToJobsFn } from "../common/interfaces";
import { writeToFile } from "../../emailer/fileHandler";
import { closeBrowser } from "../common/browserSupport";
import { getJobInformation } from "./applicationHandler";
import { handleJobApplicationsInParallel } from "../common/executionSupport";
import { getAllJobPageLinks } from "../../apiRequests/jobLever/requestHandler";

export const applyToJobs: ApplyToJobsFn = async (searchParams: any, applicationLimit = 10) => {
  let applicationPage = 0;
  let applicationsViewed = 0;
  const now = new Date().toISOString();

  while (applicationsViewed < applicationLimit) {
    applicationPage += 1;
    const jobLinks = await getAllJobPageLinks(searchParams);
    const { result } = await timeElapsed(handleJobApplicationsInParallel, jobLinks, getJobInformation);
    applicationsViewed += jobLinks.length;
    console.log("applicationsViewed:", applicationsViewed);
    writeToFile(`${searchParams.company}_${applicationPage}_${now}.json`, JSON.stringify(result));
  }
  await closeBrowser();
};
