import { flatten } from "../../utils";
import { Page, Locator } from "playwright";
import { findElementsInElement, getElementAfter, getJSDOMNode } from "../../apiRequests/htmlTraversal";

const getListItemTextContent = async (
  items: Locator[],
  locate: string,
  listItemIndex: number,
  textContentIndex?: number
): Promise<string | string[]> => {
  const content = await items[listItemIndex].locator(locate).all();
  const textContentsRaw = await Promise.all(
    content.reduce((prev: any, curr: any) => {
      const text = curr.textContent();
      return prev.concat(text).filter((item: any) => item != undefined);
    }, [])
  );
  const textContents = flatten(textContentsRaw);

  if (textContentIndex == undefined) return textContents;
  if (textContentIndex >= 0) return textContents[textContentIndex];
  return textContents[textContents.length + textContentIndex];
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

export const getApplicationBasicInfo = async (page: Page) => {
  try {
    const title = await page.locator('[class="title"]');
    const basicInfoDiv = await page.locator('[class~="job-posting-brief"]');
    const listItems = await basicInfoDiv.getByRole("listitem").all();

    return {
      title: ((await getListItemTextContent([title], "span", 0, 2)) as string).replace(/\t?\n|\t/gm, ""),
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
    const howToApplyDiv = await page.locator('[id="howtoapply"]');
    return await howToApplyDiv.getByRole("link").textContent();
  } catch (err) {
    console.log("No page button");
    console.error(err);
    return "";
  }
};
