import { getAllJobPageLinks } from "./requestHandler";
import { IScraperConfigurationOptions } from "../../interfaces";
import { getJobInformationNatively } from "./applicationHandler";
import { formatters } from "../../../storage/database/formatters/canadaRail.formatter";

export const configuration: IScraperConfigurationOptions = {
  formatters,
  parsingFunctions: { getJobInformation: getJobInformationNatively, getAllJobPageLinks },
  options: { throttleSpeed: 100, jobBoardName: "canadaRail", jobLinksQueue: "canadaRailJobLinks" },
};
