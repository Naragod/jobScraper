// setters
// ****************************************************************************

import { Page } from "playwright";

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
