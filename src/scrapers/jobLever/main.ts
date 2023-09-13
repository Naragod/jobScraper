import { Page } from "playwright";
import { getBrowserPage, closeBrowser } from "../browserSupport";
import { getAllJobPageLinks } from "../../apiRequests/jobLever/requestHandler";
import { getApplicationBasicInfo } from "../jobLever/parser";

export const getPageInformation = async (link: string, page: Page) => {
  await page.goto(link);
  const applicaitonInfo = await getApplicationBasicInfo(page);
  console.log(applicaitonInfo)
};

export const applyToJobs = async (company: string, location?: string, commitment?: string, worplaceType?: string) => {
  const browserPage = await getBrowserPage({ headless: true });
  // const jobLinks = await getAllJobPageLinks(company, location, commitment, worplaceType);
  // console.log(jobLinks);

  const link = "https://jobs.lever.co/netflix/f0615765-1451-42ae-bf76-7d3dfc1de481";
  await getPageInformation(link, browserPage);

  await closeBrowser();
};
