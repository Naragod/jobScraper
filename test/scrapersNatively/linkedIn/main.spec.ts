import {
  getApplicationBasicInfoNatively,
  getJobRequirementsNatively,
} from "../../../src/scrapers/linkedIn/nativeParser";
import { getHTMLStringFromFile } from "../../../src/utils/io";
import { getLinkedDOMNode } from "../../../src/utils/nativeHtmlTraversal";
import { applicationInfo, jobRequirements } from "./data/linkedIn_results.json";

describe("LinkedIn Scraper", () => {
  describe("LinkedIn Native Parser", () => {
    const link =
      "https://ca.linkedin.com/jobs/view/java-full-stack-software-engineer-saas-enterprise-products-at-cybercoders-3675324241?refId=LQupUM24ZKt5Uh%2BKar2zAA%3D%3D&trackingId=ax1HfFG2KTHC8vQy5DOcjg%3D%3D&position=1&pageNum=0&trk=public_jobs_jserp-result_search-card";
    const htmlString = getHTMLStringFromFile("test/scrapersNatively/linkedIn/data/linkedIn_cybercoders.html");

    describe("getApplicationBasicInfoNatively", () => {
      it("usage", () => {
        const html = getLinkedDOMNode(htmlString);
        const result = getApplicationBasicInfoNatively(link, html);
        expect(result).toEqual(applicationInfo);
      });
    });

    describe("getJobRequirementsNatively", () => {
      it("usage", () => {
        const html = getLinkedDOMNode(htmlString);
        const result = getJobRequirementsNatively(html);
        expect(result).toEqual(jobRequirements);
      });
    });

  });
});
