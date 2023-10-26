import { getJobInformationNatively } from "./applicationHandler";
import { getAllJobPageLinks } from "./requestHandler";
import { JobBoard, Scraper } from "../common/applicationHandler";
import {
  formatToJobInfoTableStructure,
  formatToJobRequirementsStructure,
} from "../../database/formatters/canadaJobBank.formatter";

export const getScraper = async () => {
  const formatters = { formatToJobInfoTableStructure, formatToJobRequirementsStructure };
  const functions = { getJobInformation: getJobInformationNatively, getAllJobPageLinks };
  const options = { throttleSpeed: 100, jobLinksQueue: "canadaJobBoardJobLinks" };
  const canadaJobBoard = new JobBoard("canadaJobBoard", functions, formatters, options);
  return new Scraper(canadaJobBoard);
};
