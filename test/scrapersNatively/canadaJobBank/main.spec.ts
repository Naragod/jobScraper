import { getHTMLStringFromFile } from "../../../src/utils/io";
import { getLinkedDOMNode } from "../../../src/utils/nativeHtmlTraversal";
import {
  applicationInfo as pageResultsApplicationInfo,
  jobRequirements as pageResultsJobRequirements,
} from "./data/page_results.json";
import { applicationInfo as incompleteJobApplicationInfo } from "./data/incomplete_job_results.json";
import {
  getApplicationBasicInfoNatively,
  getExternalLink,
  getJobRequirementsNatively,
} from "../../../src/scrapers/handlers/canadaJobBank/nativeParser";

describe("Canada Job Bank Scraper", () => {
  describe("CanadaJobBank Native Parser", () => {
    describe("getApplicationBasicInfoNatively", () => {
      it("usage", () => {
        const htmlString = getHTMLStringFromFile("test/scrapersNatively/canadaJobBank/data/page.html");
        const html = getLinkedDOMNode(htmlString);
        const result = getApplicationBasicInfoNatively(html);
        expect(result).toEqual(pageResultsApplicationInfo);
      });

      it("incomplete job posting", async () => {
        const htmlString = getHTMLStringFromFile("test/scrapersNatively/canadaJobBank/data/incomplete_job_post.html");
        const html = getLinkedDOMNode(htmlString);
        const result = getApplicationBasicInfoNatively(html);
        expect(result).toEqual(incompleteJobApplicationInfo);
      });
    });

    describe("getJobRequirementsNatively", () => {
      it("usage", async () => {
        const htmlString = getHTMLStringFromFile("test/scrapersNatively/canadaJobBank/data/page.html");
        const html = getLinkedDOMNode(htmlString);
        const result = getJobRequirementsNatively(html);
        expect(result).toEqual(pageResultsJobRequirements);
      });
    });
  });

  describe("getExternalLink", () => {
    it("usage", () => {
      const externalLink =
        "https://www.careerbeacon.com/en/job/1879927/paladin-security/casual-security-guard-perth-smiths-falls-hospital/ottawa?utm_campaign=feeds&utm_source=jobbank&utm_medium=Careerbeacon";
      const htmlString = getHTMLStringFromFile("test/scrapersNatively/canadaJobBank/data/external_link.html");
      const html = getLinkedDOMNode(htmlString);
      const result = getExternalLink(html);
      expect(result).toEqual(externalLink);
    });
  });
});
