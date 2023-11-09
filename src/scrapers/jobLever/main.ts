import { getJobInformationNatively } from "./applicationHandler";
import { JobBoard, Scraper } from "../common/applicationHandler";
import { getAllJobPageLinks } from "./requestHandler";
import {
  formatToJobInfoTableStructure,
  formatToJobRequirementsStructure,
} from "../../storage/database/formatters/joblever.formater";

export const getScraper = async () => {
  const formatters = { formatToJobInfoTableStructure, formatToJobRequirementsStructure };
  const functions = { getJobInformation: getJobInformationNatively, getAllJobPageLinks };
  const options = { throttleSpeed: 100, jobLinksQueue: "jobLeverJobLinks" };
  const jobLeverScraper = new JobBoard("jobLever", functions, formatters, options);
  return new Scraper(jobLeverScraper);
};
