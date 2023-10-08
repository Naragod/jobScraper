import { getJobInformationNatively } from "./applicationHandler";
import { JobBoard, Scraper } from "../common/applicationHandler";
import { getAllJobPageLinks } from "../../apiRequests/linkedIn/requestHandler";
import {
  formatToJobInfoTableStructure,
  formatToJobRequirementsStructure,
} from "../../database/formatters/linkedIn.formatter";

export const scrapeJobs = async (searchParams: any, applicationLimit = 100) => {
  const formatters = { formatToJobInfoTableStructure, formatToJobRequirementsStructure };
  const functions = { getJobInformation: getJobInformationNatively, getAllJobPageLinks };

  const linkedIn = new JobBoard("linkedIn", functions, formatters);
  const linkedInScraper = new Scraper(linkedIn);
  const options = { throttleSpeed: 500, concurrent: 5 };
  return await linkedInScraper.scrapeJobsNatively(searchParams, applicationLimit, options);
};
