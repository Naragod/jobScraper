import { getJobInformationNatively } from "./applicationHandler";
import { JobBoard, Scraper } from "../common/applicationHandler";
import { getAllJobPageLinks } from "./requestHandler";
import {
  formatToJobInfoTableStructure,
  formatToJobRequirementsStructure,
} from "../../database/formatters/linkedIn.formatter";

export const getScraper = async () => {
  const formatters = { formatToJobInfoTableStructure, formatToJobRequirementsStructure };
  const functions = { getJobInformation: getJobInformationNatively, getAllJobPageLinks };
  const options = { throttleSpeed: 500, jobLinksQueue: "linkedInJobLinks", concurrent: 2 };
  const linkedInScraper = new JobBoard("linkedIn", functions, formatters, options);
  return new Scraper(linkedInScraper);
};
