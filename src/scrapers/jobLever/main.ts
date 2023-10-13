import { getJobInformationNatively } from "./applicationHandler";
import { JobBoard, Scraper } from "../common/applicationHandler";
import { getAllJobPageLinks } from "./requestHandler";
import {
  formatToJobInfoTableStructure,
  formatToJobRequirementsStructure,
} from "../../database/formatters/joblever.formater";

const setup = async () => {
  const formatters = { formatToJobInfoTableStructure, formatToJobRequirementsStructure };
  const functions = { getJobInformation: getJobInformationNatively, getAllJobPageLinks };
  const options = { throttleSpeed: 100, jobLinksQueue: "jobLeverJobLinks" };
  const jobLeverScraper = new JobBoard("jobLever", functions, formatters, options);
  return new Scraper(jobLeverScraper);
};

export const searchJobs = async (searchParams: any, applicationLimit = 100) => {
  const jobLeverScraper = await setup();
  await jobLeverScraper.queueJobUrls(searchParams, applicationLimit);
};

export const parseJobs = async () => {
  const jobLeverScraper = await setup();
  await jobLeverScraper.parseJobLinks();
};

export const scrapeJobsNatively = async (searchParams: any, applicationLimit = 100) => {
  const jobLeverScraper = await setup();
  return await jobLeverScraper.scrapeJobsNatively(searchParams, applicationLimit);
};
