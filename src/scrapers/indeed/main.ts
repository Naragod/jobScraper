import { getJobInformationNatively } from "./applicationHandler";
import { getAllJobPageLinks } from "./requestHandler";
import { JobBoard, Scraper } from "../common/applicationHandler";
import {
  formatToJobInfoTableStructure,
  formatToJobRequirementsStructure,
} from "../../database/formatters/indeed.formatter";

const getScraper = async () => {
  const formatters = { formatToJobInfoTableStructure, formatToJobRequirementsStructure };
  const functions = { getJobInformation: getJobInformationNatively, getAllJobPageLinks };
  const options = { throttleSpeed: 100, jobLinksQueue: "indeed" };
  const indeedJobBoard = new JobBoard("indeed", functions, formatters, options);
  return new Scraper(indeedJobBoard);
};
