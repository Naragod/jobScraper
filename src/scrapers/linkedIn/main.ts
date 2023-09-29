import { getJobInformation } from "./applicationHandler";
import { JobBoard, Scraper } from "../common/applicationHandler";
import { getAllJobPageLinks } from "../../apiRequests/linkedIn/requestHandler";

export const scrapeJobs = async (searchParams: any, applicationLimit = 100) => {
  const functions = { getJobInformation, getAllJobPageLinks };
  const linkedIn = new JobBoard("linkedIn", functions);
  const linkedInScraper = new Scraper(linkedIn);
  return linkedInScraper.scrapeJobs(searchParams, applicationLimit);
};
