import { flatten } from "../../../utils/main";
import { getAllInnerTextElements } from "../../../utils/nativeHtmlTraversal";
import { IApplicationInfo, IJobRequirements } from "../../interfaces";

// constants
// ****************************************************************************
const REGEXES = [new RegExp("\n", "gi"), new RegExp("/", "g")];

// getters
// ****************************************************************************
export const getApplicationBasicInfoNatively = (link: string, html: NodeListOf<Element>): IApplicationInfo => {
  try {
    const company = link.split("/")[3];
    const title = flatten(getAllInnerTextElements(html, ".posting-headline H2", REGEXES))[0];
    const location = flatten(getAllInnerTextElements(html, ".posting-headline .location", REGEXES))[0];
    const description = flatten(getAllInnerTextElements(html, "[data-qa='job-description']", REGEXES));
    const department = flatten(getAllInnerTextElements(html, ".posting-headline .department", REGEXES))[0];
    const commitment = flatten(getAllInnerTextElements(html, ".posting-headline .commitment", REGEXES))[0];
    const workplaceType = flatten(getAllInnerTextElements(html, ".posting-headline .workplaceTypes", REGEXES))[0];

    return {
      title,
      company,
      pay: "",
      location,
      department,
      workplaceType,
      commitment: commitment || "",
      description: [...new Set(description)].join(", "),
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getJobRequirementsNatively = (html: NodeListOf<Element>): IJobRequirements => {
  try {
    const jobRequirements = getAllInnerTextElements(html, ".posting-requirements", REGEXES);

    if (jobRequirements.length !== 0) return { tasks: flatten(jobRequirements[0]) };
    // get all job requirements
    const miscJobReq = getAllInnerTextElements(html, "[data-qa='job-description']", REGEXES);

    if (miscJobReq.length !== 0) return { tasks: flatten(miscJobReq) };
    return { tasks: [] };
  } catch (err) {
    console.error(err);
    throw err;
  }
};
