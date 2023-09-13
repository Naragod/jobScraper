import { Page } from "playwright";
import { sleep } from "../../emailer/emailService";
import { getApplicationBasicInfo, getApplicationEmailAddress, getJobRequirements } from "./parser";
import { getBrowserPage, closeBrowser } from "../browserSupport";
import { writeToFile } from "../../emailer/fileHandler";
import { getAllJobPageLinks, baseURL as canadaJobBankBaseUrl } from "../../apiRequests/canadaJobBank/requestHandler";

const DEFAULT_JOB_AGE = 7;

export const getPageInformation = async (link: string, page: Page) => {
  try {
    await page.goto(link);
    // basic info will always appear regardless of the job application type: Should go first.
    const applicationInfo = await getApplicationBasicInfo(page);
    if (applicationInfo.jobProvider !== "Job Bank") {
      const externalLink = await page.locator('[id="externalJobLink"]').getAttribute("href");
      return { err: `Job requires application on website: LINK:${externalLink}` };
    }

    const jobRequirements = await getJobRequirements(page);
    const emailAddress = await getApplicationEmailAddress(page);
    return { emailAddress, applicationInfo, jobRequirements, err: false };
  } catch (err) {
    return { err: err };
  }
};

export const applyToJobs = async (jobTitle?: string, location?: string, applications = 10) => {
  let jobsInformation = [];
  let applicationsViewed = 0;
  const now = new Date().toDateString();
  const browserPage = await getBrowserPage({ headless: true });

  for (let applicationPage = 1; applicationPage <= applications; applicationPage++) {
    const jobLinks = await getAllJobPageLinks(jobTitle, location, DEFAULT_JOB_AGE, applicationPage);

    if (applicationsViewed >= applications) break;

    for (let link of jobLinks) {
      if (applicationsViewed >= applications) break;
      const completeLink = `${canadaJobBankBaseUrl}/${link}`;
      const pageInfo = await getPageInformation(completeLink, browserPage);
      jobsInformation.push(pageInfo);
      applicationsViewed += 1;
      await sleep(200);

      console.log(`${applicationsViewed} / ${applicationPage * jobLinks.length}`, completeLink, pageInfo);
    }
  }
  writeToFile(`job_data_${now}.json`, JSON.stringify(jobsInformation));
  await closeBrowser();
};
