import { Locator, Page } from "playwright";

import { sanitizeString } from "../../utils/parser";
import { IApplicationQuestion } from "../common/interfaces";
import { getAllTextFromHTMLContent } from "../../utils/htmlTraversal";
import { getTextContentList } from "../../utils/playwrightHtmlTraversal";

// getters
// ****************************************************************************
export const getApplicationBasicInfo = async (page: Page) => {
  const company = page.url().split("/")[3];
  const headingDiv = await page.locator(".posting-headline");
  const title = await headingDiv
    .getByRole("heading")
    .textContent()
    .catch((err) => {
      console.log(err);
      return "";
    });
  const location = await headingDiv
    .locator(".location")
    .textContent()
    .catch((err) => {
      console.log(err);
      return "";
    });
  const department = await headingDiv
    .locator(".department")
    .textContent()
    .catch((err) => {
      console.log(err);
      return "";
    });
  const commitment = await headingDiv
    .locator(".commitment")
    .textContent()
    .catch((err) => {
      console.log(err);
      return "";
    });
  const workplaceTypes = await headingDiv
    .locator(".workplaceTypes")
    .textContent()
    .catch((err) => {
      console.log(err);
      return "";
    });
  const jobDescriptionHTML = await page
    .locator("[data-qa='job-description']")
    .innerHTML()
    .catch((err) => {
      console.log(err);
      return "";
    });
  const closingJobDescriptionHTML = await page
    .locator("[data-qa='closing-description']")
    .innerHTML()
    .catch((err) => {
      console.log(err);
      return "";
    });
  const jobDescription = getAllTextFromHTMLContent(jobDescriptionHTML);
  const closingJobDescription = getAllTextFromHTMLContent(closingJobDescriptionHTML);

  return {
    jobDescription,
    closingJobDescription,
    title: sanitizeString(title),
    company: sanitizeString(company),
    department: sanitizeString(department),
    commitment: sanitizeString(commitment),
    workplaceTypes: sanitizeString(workplaceTypes),
    description: jobDescription.concat(closingJobDescription),
    location: sanitizeString(location, [new RegExp("/", "gi")]),
  };
};

export const getJobRequirements = async (page: Page) => {
  const jobRequirementsDiv = await page.locator(".posting-requirements").getByRole("listitem").all();
  return await getTextContentList(jobRequirementsDiv);
};

const getQuestionInputFields = async (question: Locator) => {
  let result = [];
  let inputs: any[] = [];
  // is input (radio, text), textbox, select? Neither textboxes nor dropdowns identify as inputs
  // we have to check for each of them otherwise inputs will be an empty array
  const selectorTypes = [
    question.locator("[class*='application-field']").locator("input").all(),
    question.locator("textarea").all(),
    question.locator("select").all(),
  ];

  for (let selectorType of selectorTypes) {
    if (inputs.length > 0) break;
    inputs = await selectorType;
  }

  for (let input of inputs) {
    const inputName = sanitizeString(await input.getAttribute("name")) || "";
    const inputType = sanitizeString(await input.getAttribute("type")) || "";
    const inputValue = sanitizeString(await input.getAttribute("value")) || "";
    const isRequired = (await input.getAttribute("required")) != null ? true : false;
    result.push({ inputName, inputValue, inputType, isRequired });
  }
  return result;
};

const getQuestionParameters = async (question: Locator): Promise<IApplicationQuestion> => {
  try {
    const labelsHTML = await question.locator("[class*='application-label']").innerHTML();
    // there is no css selector patter to include self: https://stackoverflow.com/a/59838990/8714371
    const labels = getAllTextFromHTMLContent(labelsHTML, "*", ["✱"]);
    const inputFields = await getQuestionInputFields(question);
    const { isRequired, inputType } = inputFields[0];
    return { label: labels[0], inputFields, inputType, isRequired, err: false };
  } catch (err) {
    return {
      label: await question.innerHTML(),
      inputFields: [],
      inputType: "unknown",
      isRequired: false,
      err: JSON.stringify(err),
    };
  }
};

export const getInputFields = async (page: Page): Promise<IApplicationQuestion[]> => {
  const applicationPageLink = await page.locator(".postings-btn").first().getAttribute("href");
  await page.goto(<string>applicationPageLink);

  // good to checkout css selectors discussed here: https://stackoverflow.com/a/32728646/8714371
  const applicationQuestions = await page.locator("[class='application-question']").all();
  const customApplicationQuestions = await page.locator("[class~='custom-question']").all();

  const questionPromises = [...applicationQuestions, ...customApplicationQuestions].map(getQuestionParameters);
  return (await Promise.allSettled(questionPromises)).map((item: any) => item.value);
};
