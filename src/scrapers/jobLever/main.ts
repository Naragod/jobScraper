import { getJobInformation } from "./applicationHandler";
import { JobBoard, Scraper } from "../common/applicationHandler";
import { getAllJobPageLinks } from "../../apiRequests/jobLever/requestHandler";
import {
  formatToJobInfoTableStructure,
  formatToJobRequirementsStructure,
} from "../../database/formatters/joblever.formater";

export const scrapeJobs = async (searchParams: any, applicationLimit = 100) => {
  const formatters = { formatToJobInfoTableStructure, formatToJobRequirementsStructure };
  const functions = { getJobInformation, getAllJobPageLinks };
  const jobLever = new JobBoard("jobLever", functions, formatters);
  const jobLeverScraper = new Scraper(jobLever);
  return jobLeverScraper.scrapeJobs(searchParams, applicationLimit);
};
