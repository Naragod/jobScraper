import { flatten } from "../../utils/main";
import { getAllInnerTextElements, locator } from "../../utils/nativeHtmlTraversal";

// constants
// ****************************************************************************
const REGEXES = [new RegExp("\n", "gi"), new RegExp("/", "g")];

// getters
// ****************************************************************************
export const getApplicationBasicInfoNatively = (link: string, html: NodeListOf<Element>) => {
  try {
    const company = link.split("/")[3];
    const title = flatten(getAllInnerTextElements(html, ".posting-headline H2", REGEXES))[0];
    const location = flatten(getAllInnerTextElements(html, ".posting-headline .location", REGEXES))[0];
    const description = flatten(getAllInnerTextElements(html, "[data-qa='job-description']", REGEXES));
    const department = flatten(getAllInnerTextElements(html, ".posting-headline .department", REGEXES))[0];
    const workplaceTypes = flatten(getAllInnerTextElements(html, ".posting-headline .workplaceTypes", REGEXES))[0];

    return {
      title,
      company,
      location,
      department,
      workplaceTypes,
      description: [...new Set(description)],
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getJobRequirementsNatively = (html: NodeListOf<Element>) => {
  try {
    return flatten(getAllInnerTextElements(html, ".posting-requirements", REGEXES)[0]);
  } catch (err) {
    console.error(err);
    throw err;
  }
};
