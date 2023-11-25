import { Page } from "playwright";
import { getListItemTextContent } from "../../../utils/playwrightHtmlTraversal";
import {
  findElementsInElement,
  getAllTextFromHTMLContent,
  getElementAfter,
  getJSDOMNode,
} from "../../../utils/htmlTraversal";

const getApplicationEmailAddress = async (page: Page) => {
  try {
    await page.click("[id='applynowbutton']");
    const howToApplyHTML = await page
      .locator("#howtoapply")
      .innerHTML()
      .catch((err) => {
        console.log(err);
        return "";
      });
    const eAddresses = getAllTextFromHTMLContent(howToApplyHTML, "A");
    return { eAddressErr: false, eAddresses };
  } catch (err) {
    return { eAddressErr: "No page button", eAddresses: [""] };
  }
};

export const getApplicationBasicInfo = async (page: Page) => {
  try {
    const listItems = await page
      .locator('[class~="job-posting-brief"]')
      .getByRole("listitem")
      .all()
      .catch((err) => {
        console.log(err);
        return [];
      });
    const titleHTML = await page
      .locator(".job-posting-details-body")
      .locator(".title")
      .innerHTML()
      .catch((err) => {
        console.log(err);
        return "";
      });
    const companyHTML = await page
      .locator("span[property='hiringOrganization']")
      .all()
      .catch((err) => {
        console.log(err);
        return [];
      });
    const title = getAllTextFromHTMLContent(titleHTML, "SPAN").map((item) => item.replace(/\t?\n|\t/gm, ""))[0];

    return {
      title,
      emailAddresses: await getApplicationEmailAddress(page),
      pay: await getListItemTextContent(listItems, "span", 1, 2),
      location: await getListItemTextContent(listItems, "span", 0, 2),
      company: await getListItemTextContent(companyHTML, "span", 0, 0),
      commitment: await getListItemTextContent(listItems, "span", 2, 2),
      jobId: await getListItemTextContent(listItems, "span", listItems.length - 1, -1),
      jobProvider: await getListItemTextContent(listItems, "span", listItems.length - 1, -2),
    };
  } catch (err) {
    console.error("Error while getting getApplicationBasicInfo:", page.url());
    throw err;
  }
};

export const getJobRequirements = async (page: Page) => {
  const jobRequirmentsDivHTML = await page.locator('[id="comparisonchart"]').innerHTML();
  const jobRequirementElements = getJSDOMNode(jobRequirmentsDivHTML);

  const languageSection: any = getElementAfter(jobRequirementElements, "H4", "Languages");
  let result: any = { languages: languageSection !== null ? languageSection.textContent : null };

  // the tasks, tasks, experience, etc sections generally return a list
  const sections: any = {
    tasks: getElementAfter(jobRequirementElements, "H4", "Tasks"),
    education: getElementAfter(jobRequirementElements, "H4", "Education"),
    experience: getElementAfter(jobRequirementElements, "H4", "Experience"),
    techExperience: getElementAfter(jobRequirementElements, "H4", "Computer and technology knowledge"),
  };

  for (let sectionKey in sections) {
    // get all span elements in list Node <ul> and extract their textContent
    result[sectionKey] = findElementsInElement(sections[sectionKey], "SPAN")
      .map((item) => item.textContent)
      .filter((item: any) => item != "");
  }
  return result;
};
