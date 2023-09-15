import { timeElapsed } from "../../utils";
import { closeBrowser } from "../common/browserSupport";
import { writeToFile } from "../../emailer/fileHandler";
import { getJobInformation } from "./applicationHandler";
import { getAllJobPageLinks } from "../../apiRequests/canadaJobBank/requestHandler";
import { handleJobApplicationsInParallel } from "../common/executionSupport";
import { ApplyToJobsFn } from "../common/interfaces";

export const applyToJobs: ApplyToJobsFn = async (seachParams: any, applicationLimit = 1000) => {
  let applicationPage = 0;
  let applicationsViewed = 0;
  const now = new Date().toISOString();

  while (applicationsViewed < applicationLimit) {
    applicationPage += 1;
    const jobLinks = await getAllJobPageLinks(seachParams);
    const result = await timeElapsed(handleJobApplicationsInParallel, jobLinks, getJobInformation);
    applicationsViewed += jobLinks.length;
    console.log("applicationsViewed:", applicationsViewed);
    writeToFile(`${seachParams.company}_${now}.json`, JSON.stringify(result));
  }
  await closeBrowser();
};
