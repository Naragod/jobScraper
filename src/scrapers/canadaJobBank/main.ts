import { getJobInformation } from "./applicationHandler";
import { getAllJobPageLinks } from "../../apiRequests/canadaJobBank/requestHandler";
import { JobBoard, Scraper } from "../common/applicationHandler";
import {
  formatToJobInfoTableStructure,
  formatToJobRequirementsStructure,
} from "../../database/formatters/canadaJobBank.formatter";

export const scrapeJobs = async (searchParams: any, applicationLimit = 100) => {
  const formatters = { formatToJobInfoTableStructure, formatToJobRequirementsStructure };
  const functions = { getJobInformation, getAllJobPageLinks };
  const canadaJobBoard = new JobBoard("canadaJobBoard", functions, formatters);
  const canadaJobBoardScraper = new Scraper(canadaJobBoard);
  return await canadaJobBoardScraper.scrapeJobs(searchParams, applicationLimit);
};
