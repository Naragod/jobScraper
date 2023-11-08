import { getJobInformationNatively } from "./applicationHandler";
import { getAllJobPageLinks } from "./requestHandler";
import { JobBoard, Scraper } from "../common/applicationHandler";
import {
  formatToJobInfoTableStructure,
  formatToJobRequirementsStructure,
} from "../../storage/database/formatters/cityOfToronto.formatter";

export const getScraper = async () => {
  const formatters = { formatToJobInfoTableStructure, formatToJobRequirementsStructure };
  const functions = { getJobInformation: getJobInformationNatively, getAllJobPageLinks };
  const options = { throttleSpeed: 100, jobLinksQueue: "cityOfToronto" };
  const cityOfTorontoJobBoard = new JobBoard("cityOfToronto", functions, formatters, options);
  return new Scraper(cityOfTorontoJobBoard);
};
