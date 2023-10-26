import { flatten } from "../../utils/main";
import { sanitizeString } from "../../utils/parser";
import { IApplicationInfo, IJobRequirements } from "../common/interfaces";
import { getAllInnerTextElements, executeCallbackOnNodeList } from "../../utils/nativeHtmlTraversal";

const splitApplicationInfo = (arr: any[]) => {
  let sectionInformation: any = {};
  arr.map((section: string) => {
    let [header, content = ""] = section.split(":");
    header = sanitizeString(header);
    content = sanitizeString(content);

    const idHeaders = ["Job ID"];
    const categoryHeaders = ["Job Category"];
    const locationHeaders = ["Work Location"];
    const affiliationHeaders = ["Affiliation"];
    const sectionHeaders = ["Division & Section"];
    const commitmentHeaders = ["Job Type", "Job Type & Duration"];
    const payHeaders = ["Salary", "Hourly Rate and Wage Grade", "Hourly Rate"];

    if (payHeaders.includes(header)) sectionInformation["pay"] = content;
    if (idHeaders.includes(header)) sectionInformation["jobId"] = content;
    if (sectionHeaders.includes(header)) sectionInformation["section"] = content;
    if (categoryHeaders.includes(header)) sectionInformation["category"] = content;
    if (commitmentHeaders.includes(header)) sectionInformation["commitment"] = content;
    if (affiliationHeaders.includes(header)) sectionInformation["affiliation"] = content;
    if (locationHeaders.includes(header)) sectionInformation["location"] = `Toronto, ${content}`;
  });
  return sectionInformation;
};

const getRecreationPageJobInfo = (html: NodeListOf<Element>): IApplicationInfo => {
  const regexes = [new RegExp("\n", "gi"), new RegExp("\t", "gi")];
  const title = flatten(getAllInnerTextElements(html, "[itemprop='title']", regexes))[0];
  const cleanTextContent = (child: Element, _i: number) => sanitizeString(child.textContent, regexes);
  const applicationInfoList: any[] = flatten(executeCallbackOnNodeList(html, "tr", cleanTextContent));
  const { location = "", commitment = "", pay = "", jobId, ...extra } = splitApplicationInfo(applicationInfoList);

  return { title, company: "cityOfToronto", location, commitment, pay, description: JSON.stringify(extra) || "" };
};

export const getApplicationBasicInfoNatively = (link: string, html: NodeListOf<Element>): IApplicationInfo => {
  const isRecreationJob = link.split("/").includes("recreation");
  const regexes = [new RegExp("\n", "gi"), new RegExp("/", "g")];

  if (isRecreationJob) return getRecreationPageJobInfo(html);
  const title = flatten(getAllInnerTextElements(html, "[itemprop='title']", regexes))[0];
  const cleanTextContent = (child: Element, _i: number) => sanitizeString(child.textContent, regexes);
  const infoList: any[] = flatten(executeCallbackOnNodeList(html, ".jobdescription p", cleanTextContent));
  let sectionHeaders = splitApplicationInfo(infoList);

  if (sectionHeaders.commitment == undefined && sectionHeaders.pay == undefined) {
    const jobDescriptionListElements = executeCallbackOnNodeList(html, ".jobdescription ul", cleanTextContent);
    const unorderedList: any[] = flatten(jobDescriptionListElements)[0].split("\t");
    sectionHeaders = splitApplicationInfo(unorderedList);
  }
  const { location = "Toronto", commitment = "", pay = "", ...extra } = sectionHeaders;
  return { title, company: "cityOfToronto", location, commitment, pay, description: JSON.stringify(extra) || "" };
};

export const getJobRequirementsNatively = (html: NodeListOf<Element>): IJobRequirements => {
  let result: string[] = [];
  const regexes = [new RegExp("\n", "gi"), new RegExp("/", "g")];
  const cleanTextContent = (child: Element, _i: number) => sanitizeString(child.textContent, regexes).split("\t");
  const applicationInfoList: any[] = flatten(executeCallbackOnNodeList(html, "ul", cleanTextContent)).slice(3, -1);
  const orderedApplicationInfoList: any[] = flatten(executeCallbackOnNodeList(html, "ol", cleanTextContent));
  return { tasks: [...new Set(result.concat(applicationInfoList, orderedApplicationInfoList))] };
};
