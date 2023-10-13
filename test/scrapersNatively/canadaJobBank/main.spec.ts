import {
  getApplicationBasicInfoNatively,
  getJobRequirementsNatively,
} from "../../../src/scrapers/canadaJobBank/nativeParser";
import { getHTMLStringFromFile } from "../../../src/utils/io";
import { getLinkedDOMNode } from "../../../src/utils/nativeHtmlTraversal";
import { applicationInfo as pageResultsApplicationInfo, jobRequirements as pageResultsJobRequirements } from "./data/page_results.json";
import { applicationInfo as incompleteJobApplicationInfo } from "./data/page_results.json";

describe("Canada Job Bank Scraper", () => {
  describe("CanadaJobBank Native Parser", () => {
    const link =
      "https://www.jobbank.gc.ca/jobsearch/jobposting/39271451;jsessionid=0EE207FB8A6459E3CE099D9B5E26A865.jobsearch74?source=searchresults";

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
});
