import { getJobInformation } from "./applicationHandler";
import { JobBoard, Scraper } from "../common/applicationHandler";
import { getAllJobPageLinks } from "../../apiRequests/linkedIn/requestHandler";
import {
  formatToJobInfoTableStructure,
  formatToJobRequirementsStructure,
} from "../../database/formatters/linkedIn.formatter";

export const scrapeJobs = async (searchParams: any, applicationLimit = 100) => {
  const formatters = { formatToJobInfoTableStructure, formatToJobRequirementsStructure };
  const functions = { getJobInformation, getAllJobPageLinks };

  const linkedIn = new JobBoard("linkedIn", functions, formatters);
  const linkedInScraper = new Scraper(linkedIn);
  return await linkedInScraper.scrapeJobsNatively(searchParams, applicationLimit, { throttleSpeed: 500, concurrent: 5 });
};
