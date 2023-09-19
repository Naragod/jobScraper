import { Page } from "playwright";
import { getElementAfter, getJSDOMNode } from "../../apiRequests/htmlTraversal";
import { getAllTextFromHTMLContent, getListItemTextContent } from "../../apiRequests/htmlSpecificImplementations";

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

  sections.map((sectionKey: string) => (result[sectionKey] = getAllTextFromHTMLContent(sections[sectionKey], "SPAN")));
  return result;
};

export const getApplicationBasicInfo = async (page: Page) => {
  try {
    const listItems = await page.locator('[class~="job-posting-brief"]').getByRole("listitem").all();
    const titleHTML = await page.locator(".job-posting-details-body").locator(".title").innerHTML();
    const title = getAllTextFromHTMLContent(titleHTML, "SPAN").map((item) => item.replace(/\t?\n|\t/gm, ""))[0];

    return {
      title,
      location: await getListItemTextContent(listItems, "span", 0, 2),
      pay: await getListItemTextContent(listItems, "span", 1, 2),
      jobId: await getListItemTextContent(listItems, "span", listItems.length - 1, -1),
      jobProvider: await getListItemTextContent(listItems, "span", listItems.length - 1, -2),
    };
  } catch (err) {
    console.log("Error while getting getApplicationBasicInfo:", page.url());
    throw err;
  }
};

export const getApplicationEmailAddress = async (page: Page) => {
  try {
    await page.click("[id='applynowbutton']");
    const howToApplyHTML = await page.locator("#howtoapply").innerHTML();
    const emailAddresses = getAllTextFromHTMLContent(howToApplyHTML, "A");
    return { eAddressErr: false, emailAddresses };
  } catch (err) {
    return { eAddressErr: "No page button", emailAddresses: "" };
  }
};
