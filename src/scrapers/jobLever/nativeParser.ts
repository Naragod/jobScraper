import { Locator, Page } from "playwright";

import { sanitizeString } from "../../utils/parser";
import { IApplicationQuestion } from "../common/interfaces";
import { getAllTextFromHTMLContent } from "../../utils/htmlTraversal";
import { getTextContentList } from "../../utils/playwrightHtmlTraversal";
import { getAllInnerTextElements, getNativeNodeList, locator } from "../../utils/nativeHtmlTraversal";
import { flatten } from "../../utils/main";

// getters
// ****************************************************************************
export const getApplicationBasicInfoNatively = (link: string, html: NodeListOf<Element>) => {
  try {
    const regexes = [new RegExp("\n", "gi"), new RegExp("/", "g")];
    const company = link.split("/")[3];
    const headingDiv = locator(html, ".posting-headline")[0];
    const title = flatten(getAllInnerTextElements(headingDiv, "H2"))[0];
    const location = flatten(getAllInnerTextElements(headingDiv, ".location"))[0];
    const department = flatten(getAllInnerTextElements(headingDiv, ".department"))[0];
    const workplaceTypes = flatten(getAllInnerTextElements(headingDiv, ".workplaceTypes"))[0];

    const jobDescriptionHTML = locator(html, "[data-qa='job-description']")[0];
    const description = flatten(getAllInnerTextElements(jobDescriptionHTML, "*")).map((item) =>
      sanitizeString(item, regexes),
    );

    return {
      company,
      description: [...new Set(description)],
      title: sanitizeString(title, regexes),
      location: sanitizeString(location, regexes),
      department: sanitizeString(department, regexes),
      workplaceTypes: sanitizeString(workplaceTypes, regexes),
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getJobRequirementsNatively = (html: NodeListOf<Element>) => {
  try {
    const regexes = [new RegExp("\n", "gi")];
    const result = flatten(getAllInnerTextElements(html, ".posting-requirements")[0]);
    return result.map((item) => sanitizeString(item, regexes));
  } catch (err) {
    console.error(err);
    throw err;
  }
};