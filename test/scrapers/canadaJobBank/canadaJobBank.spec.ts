import { Page } from "playwright";
import { closeBrowser, getBrowserPage } from "../../../src/scrapers/common/browserSupport";
import {
  getApplicationBasicInfo,
  getJobRequirements,
  getApplicationEmailAddress,
} from "../../../src/scrapers/canadaJobBank/parser";
import { getJobInformation } from "../../../src/scrapers/canadaJobBank/applicationHandler";

// Expected Content
// ****************************************************************************
import { applicationInfo, jobRequirements, link, applicationEmailAddress } from "./data/jobInfo.json";

describe("CanadaJobBank", () => {
  let page: Page;
  const baseUrl = "https://www.jobbank.gc.ca/jobsearch/jobposting/39094276";

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

    it("getApplicationEmailAddress - Usage", async () => {
      await page.goto(baseUrl);
      const result = await getApplicationEmailAddress(page);
      expect(result).toEqual(applicationEmailAddress);
    }, 8000);
  });

  describe("Application Handler", () => {
    it("getJobInformation - Usage", async () => {
      const result = await getJobInformation(baseUrl, page);
      expect(result).toEqual({
        link,
        jobRequirements,
        applicationInfo,
        emailAddresses: applicationEmailAddress["emailAddresses"],
        err: false,
      });
    }, 8000);
  });
});
