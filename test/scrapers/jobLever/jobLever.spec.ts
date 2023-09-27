import { Page } from "playwright";
import { getJobInformation } from "../../../src/scrapers/jobLever/applicationHandler";
import { closeBrowser, getBrowserPage } from "../../../src/scrapers/common/browserSupport";
import { getApplicationBasicInfo, getJobRequirements, getInputFields } from "../../../src/scrapers/jobLever/parser";

// Expected Content
// ****************************************************************************
import { inputFields } from "../data/jobLever/inputFields.json";
import { applicationInfo, jobRequirements, link } from "../data/jobLever/jobInfo.json";

describe("JobLever", () => {
  let page: Page;
  const baseUrl = "https://jobs.lever.co/eventbrite/8ec0f8df-3542-43aa-ae4f-c45e9d25537a";

  beforeEach(async () => {
    page = await getBrowserPage();
  });

  afterEach(async () => {
    await closeBrowser();
  });

  describe("Parser", () => {
    it("getJobRequirements - Usage", async () => {
      await page.goto(baseUrl);
      const result = await getJobRequirements(page);
      expect(result).toEqual(jobRequirements);
    });

    it("getApplicationBasicInfo - Usage", async () => {
      await page.goto(baseUrl);
      const result = await getApplicationBasicInfo(page);
      expect(result).toEqual(applicationInfo);
    });

    it("getInputFields - Usage", async () => {
      await page.goto(baseUrl);
      const result = await getInputFields(page);
      expect(result).toEqual(inputFields);
    }, 8000);
  });

  describe("Application Handler", () => {
    it("getJobInformation - Usage", async () => {
      const result = await getJobInformation(baseUrl, page);
      expect(result).toEqual({
        link,
        jobRequirements,
        applicationInfo,
        applicationInputFields: inputFields,
        err: false,
      });
    }, 8000);
  });
});
