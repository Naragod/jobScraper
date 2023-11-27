import { getAllJobPageLinks } from "./requestHandler";
import { IScraperConfigurationOptions } from "../../interfaces";
import { getJobInformationNatively } from "./applicationHandler";
import { formatters } from "../../../storage/database/formatters/linkedIn.formatter";

export const configuration: IScraperConfigurationOptions = {
  formatters,
  parsingFunctions: { getJobInformation: getJobInformationNatively, getAllJobPageLinks },
  options: { concurrent: 2, throttleSpeed: 500, jobLinksQueue: "linkedInJobLinks", jobBoardName: "linkedIn" },
};
