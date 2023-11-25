import { getAllJobPageLinks } from "./requestHandler";
import { getJobInformationNatively } from "./applicationHandler";
import { IScraperConfigurationOptions } from "../../interfaces";
import { formatters } from "../../../storage/database/formatters/canadaJobBank.formatter";

export const configuration: IScraperConfigurationOptions = {
  formatters,
  parsingFunctions: { getJobInformation: getJobInformationNatively, getAllJobPageLinks },
  options: { throttleSpeed: 100, jobLinksQueue: "canadaJobBoardJobLinks", jobBoardName: "CanadaJobBoard" },
};
