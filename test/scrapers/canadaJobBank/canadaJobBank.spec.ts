import { Page } from "playwright";
import { closeBrowser, getBrowserPage } from "../../../src/scrapers/common/playwrightBrowserSupport";
import { getJobInformation } from "../../../src/scrapers/canadaJobBank/applicationHandler";
import { getApplicationBasicInfo, getJobRequirements } from "../../../src/scrapers/canadaJobBank/parser";

// Expected Content
// ****************************************************************************
import { applicationInfo, jobRequirements, link } from "./data/jobInfo.json";

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
  });

  describe("Application Handler", () => {
    it("getJobInformation - Usage", async () => {
      const result = await getJobInformation(baseUrl, page);
      expect(result).toEqual({
        link,
        jobRequirements,
        applicationInfo,
        err: false,
      });
    }, 8000);
  });
});
