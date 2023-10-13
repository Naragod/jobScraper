import { getJobInformationNatively } from "./applicationHandler";
import { getAllJobPageLinks } from "./requestHandler";
import { JobBoard, Scraper } from "../common/applicationHandler";
import {
  formatToJobInfoTableStructure,
  formatToJobRequirementsStructure,
} from "../../database/formatters/canadaJobBank.formatter";

const setup = async () => {
  const formatters = { formatToJobInfoTableStructure, formatToJobRequirementsStructure };
  const functions = { getJobInformation: getJobInformationNatively, getAllJobPageLinks };
  const canadaJobBoard = new JobBoard("canadaJobBoard", functions, formatters);
  return new Scraper(canadaJobBoard);
};
export const searchJobs = async (searchParams: any, applicationLimit = 100) => {
  const canadaJobBoardScraper = await setup();
  await canadaJobBoardScraper.queueJobUrls(searchParams, applicationLimit);
  // return await canadaJobBoardScraper.scrapeJobsNatively(searchParams, applicationLimit);
};

export const parseJobs = async () => {
  const canadaJobBoardScraper = await setup();
  await canadaJobBoardScraper.parseJobLinks();
};

export const scrapeJobsNatively = async (searchParams: any, applicationLimit = 100) => {
  const canadaJobBoardScraper = await setup();
  return await canadaJobBoardScraper.scrapeJobsNatively(searchParams, applicationLimit);
};
