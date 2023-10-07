import { findElementsInElement } from "../../utils/htmlTraversal";
import { flatten } from "../../utils/main";
import { locator, getAllInnerTextElements, getElementAfterNatively } from "../../utils/nativeHtmlTraversal";

export const getApplicationBasicInfoNatively = (html: NodeListOf<Element>) => {
  const titleHtml = locator(html, ".job-posting-details-body").map((item) => getAllInnerTextElements(item, ".title"));
  const companyHTML = getAllInnerTextElements(html, "span[property='hiringOrganization']");
  const listItems = getAllInnerTextElements(html, ".job-posting-brief");
  const title = [...new Set(flatten(titleHtml))][0];

  const company = flatten(companyHTML)[0];
  const pay = listItems[1].slice(1).join(", ");
  const location = listItems[0].slice(1).join(", ");
  const commitment = listItems[2].slice(1).join(", ");
  const jobId = listItems[listItems.length - 1].slice(-1)[0];
  const jobProvider = listItems[listItems.length - 1].slice(-2, -1)[0];

  return {
    title,
    pay,
    jobId,
    company,
    location,
    commitment,
    jobProvider,
  };
};

export const getJobRequirementsNatively = async (html: NodeListOf<Element>) => {
  const jobRequirementElements = locator(html, "#comparisonchart")[0];

  // the languages section for some reason is a paragraph <p> while all other sections are lists of spans <span>
  const languageSection: any = getElementAfterNatively(jobRequirementElements, "H4", "Languages");
  let result: any = { languages: languageSection !== null ? languageSection.textContent : null };

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
      .map((item) => item.textContent)
      .filter((item: any) => item != "");
  }
  return result;
};
