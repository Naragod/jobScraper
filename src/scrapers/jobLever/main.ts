import { timeElapsed } from "../../utils";
import { IJobInfo, scrapeJobsFn } from "../common/interfaces";
import { writeToFile } from "../../emailer/fileHandler";
import { closeBrowser } from "../common/browserSupport";
import { getJobInformation } from "./applicationHandler";
import { handleJobApplicationsInParallel } from "../common/executionSupport";
import { getAllJobPageLinks } from "../../apiRequests/jobLever/requestHandler";

export const scrapeJobs: scrapeJobsFn = async (searchParams: any, applicationLimit = 10) => {
  let applicationPage = 0;
  let applicationsViewed = 0;
  const now = new Date().toISOString();
  const jobsInformation: IJobInfo[] = [];

  while (applicationsViewed < applicationLimit) {
    applicationPage += 1;
    const jobLinks = await getAllJobPageLinks(searchParams);
    const { result } = await timeElapsed<IJobInfo>(handleJobApplicationsInParallel, jobLinks, getJobInformation);
    jobsInformation.push(result);
    applicationsViewed += jobLinks.length;
    console.log("applicationsViewed:", applicationsViewed);
    writeToFile(`${searchParams.company}_${applicationPage}_${now}.json`, JSON.stringify(result));
  }
  await closeBrowser();
  return jobsInformation;
};

// const page = await getBrowserPage({ headless: true });

// const link = "https://jobs.lever.co/eventbrite/cb92a999-05f6-4db7-ab42-c78f3574ecd3";
// const link = "https://jobs.lever.co/eventbrite/76a2bc1c-5d91-4e46-896c-f689155fad75";
// await getJobInformation(link, page);
