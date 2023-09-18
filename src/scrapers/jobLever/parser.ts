import { Locator, Page } from "playwright";
// const HttpClient = require("../../captcha/endcaptcha.js");
// const client = new HttpClient("lukasworldy", "mainMateoPass!1");

import { getTextContentList, getAllTextFromChildNodes, getJSDOMNode } from "../../apiRequests/htmlTraversal";
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

  return {
    title,
    location,
    department,
    commitment,
    workplaceTypes,
  };
};

export const getJobRequirements = async (page: Page) => {
  const jobRequirementsDiv = await page.locator(".posting-requirements").getByRole("listitem").all();
  return await getTextContentList(jobRequirementsDiv);
};

const getQuestionInputFields = async (inputs: Locator[], defaultInputType = "textarea") => {
  let result = [];

  for (let input of inputs) {
    const inputName = await input.getAttribute("name");
    const inputValue = await input.getAttribute("value");
    const inputType = (await input.getAttribute("type")) || defaultInputType;
    const isRequired = (await input.getAttribute("required")) != null ? true : false;
    result.push({ inputName, inputValue, inputType, isRequired });
  }
  return result;
};

const getQuestionParameters = async (question: Locator): Promise<IApplicationQuestion> => {
  try {
    const labelsHTML = await question.locator("[class*='application-label']").innerHTML();
    const inputFieldDivs = await question.locator("[class*='application-field']").locator("input").all();
    // is textbox? textboxes do not identify as inputs such as radio btns, meaning inputFieldDivs will be an empty array
    const inputDivs = inputFieldDivs.length == 0 ? await question.locator("textarea").all() : inputFieldDivs;

    const allLabels = [...getJSDOMNode(labelsHTML)].map((item) => getAllTextFromChildNodes(item, ["", "✱"])).flat();
    const inputFields = await getQuestionInputFields(inputDivs);
    const uniqueLabels = [...new Set(allLabels)];

    // application is guaranteed to have a name and email input field.
    const { isRequired, inputType } = inputFields[0];
    return { label: uniqueLabels[0], inputFields, inputType, isRequired, err: false };
  } catch (err) {
    const html = await question.innerHTML();
    console.log(html);
    console.log(err);
    return { label: "", inputFields: [], inputType: "", isRequired: false, err };
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
