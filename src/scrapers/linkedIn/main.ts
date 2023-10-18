import { getJobInformationNatively } from "./applicationHandler";
import { JobBoard, Scraper } from "../common/applicationHandler";
import { getAllJobPageLinks } from "./requestHandler";
import {
  formatToJobInfoTableStructure,
  formatToJobRequirementsStructure,
} from "../../database/formatters/linkedIn.formatter";

const setup = async () => {
  const formatters = { formatToJobInfoTableStructure, formatToJobRequirementsStructure };
  const functions = { getJobInformation: getJobInformationNatively, getAllJobPageLinks };
  const options = { throttleSpeed: 100, jobLinksQueue: "linkedInJobLinks" };
  const linkedInScraper = new JobBoard("linkedIn", functions, formatters, options);
  return new Scraper(linkedInScraper);
};

export const searchJobs = async (searchParams: any, applicationLimit = 100) => {
  const linkedInScraper = await setup();
  await linkedInScraper.queueJobUrls(searchParams, applicationLimit);
};

export const parseJobs = async (options: any) => {
  const linkedInScraper = await setup();
  await linkedInScraper.parseJobLinks(options);
};

export const scrapeJobsNatively = async (searchParams: any, applicationLimit = 100) => {
  const linkedInScraper = await setup();
  return await linkedInScraper.scrapeJobsNatively(searchParams, applicationLimit);
};
