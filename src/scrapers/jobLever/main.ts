import { getAllJobPageLinks } from "../../apiRequests/jobLever/requestHandler";
import { getBrowserPage, closeBrowser } from "../browserSupport";
import { getApplicationBasicInfo, getApplicationEmailAddress, getJobRequirements } from "../canadaJobBank/parser";

export const applyToJobs = async (company: string, location?: string, commitment?: string, worplaceType?: string) => {
  const browserPage = await getBrowserPage({ headless: true });
  const jobLinks = await getAllJobPageLinks(company, location, commitment, worplaceType);
  console.log(jobLinks)
};
