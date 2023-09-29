import { getJobInformation } from "./applicationHandler";
import { getAllJobPageLinks } from "../../apiRequests/canadaJobBank/requestHandler";
import { JobBoard, Scraper } from "../common/applicationHandler";

export const scrapeJobs = async (searchParams: any, applicationLimit = 100) => {
  const functions = { getJobInformation, getAllJobPageLinks };
  const canadaJobBoard = new JobBoard("canadaJobBoard", functions);
  const canadaJobBoardScraper = new Scraper(canadaJobBoard);
  return canadaJobBoardScraper.scrapeJobs(searchParams, applicationLimit);
};
