import { flatten } from "../../../utils/main";
import { getAllInnerTextElements } from "../../../utils/nativeHtmlTraversal";
import { IApplicationInfo, IJobRequirements } from "../../interfaces";

const getLocation = (html: NodeListOf<Element>) => {
  const location = flatten(getAllInnerTextElements(html, "[data-tag='displayLocationMessage']"))[0];
  const availableLocations = flatten(getAllInnerTextElements(html, "[data-tag='LocationDisplayTitle']"));

  if (availableLocations.length > 0) return availableLocations.join(" | ");
  return location;
};

export const getApplicationBasicInfoNatively = (html: NodeListOf<Element>): IApplicationInfo => {
  const location = getLocation(html);
  const regexes = [new RegExp("\n", "gi"), new RegExp("/", "g")];
  const description = flatten(getAllInnerTextElements(html, ".p-htmlviewer[data-tag='']", regexes))[0];
  const title = flatten(getAllInnerTextElements(html, "[data-tag='ReqTitle']", regexes))[0];
  return { title, company: "CanadaRail", location, description, pay: "" };
};

export const getJobRequirementsNatively = (html: NodeListOf<Element>): IJobRequirements => {
  const regexes = [new RegExp("\n", "gi"), new RegExp("/", "g")];
  const allTasks = flatten(getAllInnerTextElements(html, ".p-htmlviewer[data-tag='']", regexes));
  const tasks = allTasks.slice(1, allTasks.indexOf("About CN"));
  return { tasks };
};
