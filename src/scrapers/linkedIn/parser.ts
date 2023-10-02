import { Page } from "playwright";
import { sanitizeString } from "../../utils/parser";
import { getAllTextFromHTMLContent } from "../../utils/htmlTraversal";

export const getJobRequirements = async (page: Page) => {
  try {
    const descriptionDiv = await page
      .locator(".show-more-less-html__markup")
      .innerHTML()
      .catch((err) => {
        console.log("Page:", page.url());
        console.error(err);
        return "";
      });
    return getAllTextFromHTMLContent(descriptionDiv);
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const getApplicationBasicInfo = async (page: Page) => {
  try {
    let err: any = {};
    let externalLink = "";
    let miscelaneousInformation: any = {};
    const companyLocationDiv = await page.locator(".topcard__flavor").all();
    const title = await page.locator("h1.top-card-layout__title").textContent();
    const criteriaList = await page.locator("li.description__job-criteria-item").all();

    const location = await companyLocationDiv[1].textContent().catch((err) => {
      err["location"] = err.message;
      return "";
    });
    const companyName = await companyLocationDiv[0]
      .locator("a")
      .textContent()
      .catch((err) => {
        err["companyName"] = err.message;
        return "";
      });
    const companyLink = await companyLocationDiv[0]
      .locator("a")
      .getAttribute("href")
      .catch((err) => {
        err["companyLink"] = err.message;
        return "";
      });
    const pay = await page
      .locator(".compensation__salary")
      .textContent()
      .catch((err) => {
        err["pay"] = err.message;
        return "";
      });
    const externalLinks = await page
      .locator("[data-tracking-control-name='public_jobs_apply-link-offsite_sign-up-modal-sign-up-later']")
      .all()
      .catch((err) => {
        err["externalLinks"] = err.message;
        return [];
      });

    if (externalLinks.length != 0) {
      externalLink = (await externalLinks[0].getAttribute("href")) || "";
      err["externalLink"] = "This is likely an Easy Apply job which requires a linkedIn Account";
    }

    for (let criteria of criteriaList) {
      const criteriaHeader = (await criteria.locator("h3.description__job-criteria-subheader").textContent()) || "";
      const criteriaDecription = await criteria.locator("span.description__job-criteria-text").textContent();
      miscelaneousInformation[sanitizeString(criteriaHeader)] = sanitizeString(criteriaDecription);
    }

    return {
      title,
      externalLink,
      miscelaneousInformation,
      pay: sanitizeString(pay),
      location: sanitizeString(location),
      company: sanitizeString(companyName),
      companyLink: sanitizeString(companyLink),
      err,
    };
  } catch (err) {
    console.error("Error while getting getApplicationBasicInfo:", page.url());
    throw err;
  }
};
