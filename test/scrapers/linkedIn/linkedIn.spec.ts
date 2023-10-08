import { Page } from "playwright";
import { getApplicationBasicInfo, getJobRequirements } from "../../../src/scrapers/linkedIn/parser";
import { getBrowserPage, closeBrowser } from "../../../src/scrapers/common/playwrightBrowserSupport";

// Expected Content
// ****************************************************************************
import { jobRequirements, link, applicationInfo } from "./data/jobInfo.json";

describe("LinkedIn", () => {
  let page: Page;
  const baseUrl =
    "https://www.linkedin.com/jobs/view/java-developer-at-extreme-reach-3702835247?refId=c1HT%2FkRcs9tF3tVAAxyRsA%3D%3D&trackingId=0gL8L2gb9tyeYpSTJPy7RA%3D%3D";

  beforeEach(async () => {
    page = await getBrowserPage({ timeout: 8000 });
  });

  afterEach(async () => {
    await closeBrowser();
  });

  describe("Parser", () => {
    it("getApplicationBasicInfo - Usage", async () => {
      await page.goto(baseUrl);
      const result = await getApplicationBasicInfo(page);
      expect(result).toEqual(applicationInfo);
    }, 10000);

    it("getJobRequirements - Usage", async () => {
      await page.goto(baseUrl);
      const result = await getJobRequirements(page);
      expect(result).toEqual(jobRequirements);
    }, 10000);
  });
});
