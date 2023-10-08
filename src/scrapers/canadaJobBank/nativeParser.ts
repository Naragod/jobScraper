import { findElementsInElement } from "../../utils/htmlTraversal";
import { destructureObj, flatten } from "../../utils/main";
import {
  locator,
  getAllInnerTextElements,
  getElementAfterNatively,
  executeCallbackOnNodeList,
  getInnerText,
} from "../../utils/nativeHtmlTraversal";
import { IApplicationInfo, IJobRequirements } from "../common/interfaces";

const jobInfoMapper = (child: Element, i: number) => {
  let result: any = {};
  const value = getInnerText(child);

  if (i == 0) result["location"] = value.slice(1).join(", ");
  else if (i == 1) result["pay"] = value.slice(1).join(", ");
  else if (i == 2) result["commitment"] = value.slice(1).join(", ");
  else if (i == 7) {
    result["jobId"] = value.slice(1)[1];
    result["jobProvider"] = value.slice(1)[0];
  } else return;

  return result;
};

export const getApplicationBasicInfoNatively = (html: NodeListOf<Element>): IApplicationInfo => {
  const title = flatten(getAllInnerTextElements(html, ".job-posting-details-body .title"))[0];
  const company = flatten(getAllInnerTextElements(html, "span[property='hiringOrganization']"))[0];

  const rawJobInfo = executeCallbackOnNodeList(html, "ul.job-posting-brief > li", jobInfoMapper);
  const { result } = destructureObj(rawJobInfo, ["location", "pay", "commitment", "jobId", "jobProvider"]);
  return { title, company, ...result };
};

export const getJobRequirementsNatively = (html: NodeListOf<Element>): IJobRequirements => {
  const regexes = [new RegExp("\n", "gi"), new RegExp("/", "g")];
  const jobRequirementElements = locator(html, "#comparisonchart")[0];

  // the languages section for some reason is a paragraph <p> while all other sections are lists of spans <span>
  const languageSection: any = getElementAfterNatively(jobRequirementElements, "H4", "Languages");
  let result: any = { languages: languageSection !== null ? getInnerText(languageSection).join() : null };

  // the tasks, tasks, experience, etc sections generally return a list
  const sections: any = {
    tasks: getElementAfterNatively(jobRequirementElements, "H4", "Tasks"),
    education: getElementAfterNatively(jobRequirementElements, "H4", "Education"),
    experience: getElementAfterNatively(jobRequirementElements, "H4", "Experience"),
    techExperience: getElementAfterNatively(jobRequirementElements, "H4", "Computer and technology knowledge"),
  };

  for (let sectionKey in sections) {
    // get all span elements in list Node <ul> and extract their textContent
    result[sectionKey] = findElementsInElement(sections[sectionKey], "SPAN")
      .map((item) => flatten(getInnerText(item, regexes)).join(", "))
      .filter((item: any) => item != "");
  }
  return result;
};
