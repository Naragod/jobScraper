import { flatten } from "../../../utils/main";
import { IApplicationInfo, IJobRequirements } from "../../interfaces";
import { getAllTextFromHTMLContent } from "../../../utils/htmlTraversal";
import { getAllInnerTextElements } from "../../../utils/nativeHtmlTraversal";

const getLocation = (jobLocation: any[]): string => {
  return jobLocation
    .map((item) => {
      const { addressLocality, addressRegion, addressCountry } = item.Address;
      const { Name: country } = addressCountry;
      return `${addressLocality}, ${addressRegion}, ${country}`;
    })
    .join(" | ");
};

const getScriptContent = (html: NodeListOf<Element>) => {
  const regexes = [new RegExp("\n", "gi"), new RegExp("/", "g"), new RegExp("\t", "gi")];
  const rawContent = flatten(getAllInnerTextElements(html, "script[type='application/ld+json']", regexes))[0];
  return JSON.parse(rawContent);
};

export const getApplicationBasicInfoNatively = (html: NodeListOf<Element>): IApplicationInfo => {
  const { Title: title, jobLocation } = getScriptContent(html);

  return { title, company: "CanadaRail", location: getLocation(jobLocation), pay: "" };
};

export const getJobRequirementsNatively = (html: NodeListOf<Element>): IJobRequirements => {
  const { Description: rawDescription } = getScriptContent(html);

  return { tasks: getAllTextFromHTMLContent(rawDescription) };
};
