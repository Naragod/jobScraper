import { Locator, Page } from "playwright";
// const HttpClient = require("../../captcha/endcaptcha.js");
// const client = new HttpClient("lukasworldy", "mainMateoPass!1");

import { getTextContentList, getAllTextFromHTMLContent } from "../../apiRequests/htmlTraversal";
import { IApplicationQuestion } from "../common/interfaces";

// getters
// ****************************************************************************
export const getApplicationBasicInfo = async (page: Page) => {
  const headingDiv = await page.locator(".posting-headline");
  const title = await headingDiv.getByRole("heading").textContent();
  const location = await headingDiv.locator(".location").textContent();
  const department = await headingDiv.locator(".department").textContent();
  const commitment = await headingDiv.locator(".commitment").textContent();
  const workplaceTypes = await headingDiv.locator(".workplaceTypes").textContent();
  const jobDescriptionHTML = await page.locator("[data-qa='job-description']").innerHTML();
  const closingJobDescriptionHTML = await page.locator("[data-qa='closing-description']").innerHTML();
  const jobDescription = getAllTextFromHTMLContent(jobDescriptionHTML);
  const closingJobDescription = getAllTextFromHTMLContent(closingJobDescriptionHTML);

  return {
    title,
    location,
    department,
    commitment,
    workplaceTypes,
    jobDescription,
    closingJobDescription,
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
    const inputName = (await input.getAttribute("name")) || "";
    const inputType = (await input.getAttribute("type")) || "";
    const inputValue = (await input.getAttribute("value")) || "";
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
    return { label: await question.innerHTML(), inputFields: [], inputType: "unknown", isRequired: false, err };
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

// setters
// ****************************************************************************
const setRequiredFields = async (inputs: any[], data: any) => {
  for (let input of inputs) {
    const inputName = await input.getAttribute("name");
    const inputType = await input.getAttribute("type");
    const isRequired = (await input.getAttribute("required")) != null ? true : false;
    console.log(inputName, inputType, isRequired);

    if (!isRequired) continue;
    if (data[inputName] == undefined) {
      if (inputType == "text" || null) {
        console.log(`Filling property <${inputName}> with default value: N/A`);
        await input.fill("N/A");
        continue;
      }
      throw new Error("Have no default check, or radio value");
    }
    await input.fill(data[inputName]);
  }
};

export const fillInApplication = async (page: Page, userData: any) => {
  const { resume, email, ...data } = userData;
  const applicationPageLink = await page.locator(".postings-btn").first().getAttribute("href");
  const originalPageLink = page.url();

  await page.goto(<string>applicationPageLink);

  const textboxes = await page.locator("input[type*='text']").all();
  const textAreas = await page.locator("textarea").all();
  const radioBtns = await page.getByRole("radio").all();
  const checkboxes = await page.getByRole("checkbox").all();
  await page.locator("#resume-upload-input").setInputFiles(resume);
  await page.locator("input[type*='email']").fill(email);
  console.log(`File: ${resume} - successfully uploaded.`);

  await setRequiredFields(textboxes, data);
  await setRequiredFields(radioBtns, data);
  await setRequiredFields(textAreas, data);
  await setRequiredFields(checkboxes, data);
  const captchaSiteKey = await page.locator("#h-captcha").getAttribute("data-sitekey");
  const currentPageUrl = page.url();
  console.log("captchaSiteKey:", captchaSiteKey);
  console.log("originalPageLink:", originalPageLink, "currentPageUrl:", currentPageUrl);

  await page.locator("#btn-submit").click();
  console.log("Application button clicked.");
  await page.waitForURL(`${originalPageLink}/thanks`);
  console.log("Successfully submitted application.");
};
