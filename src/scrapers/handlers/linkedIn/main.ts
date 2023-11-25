import { getAllJobPageLinks } from "./requestHandler";
import { IScraperConfigurationOptions } from "../../interfaces";
import { getJobInformationNatively } from "./applicationHandler";
import { formatters } from "../../../storage/database/formatters/linkedIn.formatter";

export const configuration: IScraperConfigurationOptions = {
  formatters,
  parsingFunctions: { getJobInformation: getJobInformationNatively, getAllJobPageLinks },
  options: { throttleSpeed: 500, jobLinksQueue: "linkedInJobLinks", concurrent: 2, jobBoardName: "linkedIn" },
};
