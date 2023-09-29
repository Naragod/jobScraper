import { getJobInformation } from "./applicationHandler";
import { JobBoard, Scraper } from "../common/applicationHandler";
import { getAllJobPageLinks } from "../../apiRequests/jobLever/requestHandler";

export const scrapeJobs = async (searchParams: any, applicationLimit = 100) => {
  const functions = { getJobInformation, getAllJobPageLinks };
  const jobLever = new JobBoard("jobLever", functions);
  const jobLeverScraper = new Scraper(jobLever);
  return jobLeverScraper.scrapeJobs(searchParams, applicationLimit);
};
