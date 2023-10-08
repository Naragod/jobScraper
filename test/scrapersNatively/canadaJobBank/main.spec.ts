import { getApplicationBasicInfoNatively, getJobRequirementsNatively } from "../../../src/scrapers/canadaJobBank/nativeParser";
import { getHTMLStringFromFile } from "../../../src/utils/io";
import { getLinkedDOMNode } from "../../../src/utils/nativeHtmlTraversal";
import { jobInformation, jobRequirements } from "./data/page_results.json";

describe("Canada Job Bank Scraper", () => {
  describe("CanadaJobBank Native Parser", () => {
    const link = "https://www.jobbank.gc.ca/jobsearch/jobposting/39271451;jsessionid=0EE207FB8A6459E3CE099D9B5E26A865.jobsearch74?source=searchresults";
    const htmlString = getHTMLStringFromFile("test/scrapersNatively/canadaJobBank/data/page.html");

    it("getApplicationBasicInfoNatively - Usage", async () => {
      const html = getLinkedDOMNode(htmlString);
      const result = getApplicationBasicInfoNatively(html);
      expect(result).toEqual(jobInformation);
    });

    it("getJobRequirementsNatively - Usage", async () => {
        const html = getLinkedDOMNode(htmlString);
        const result = getJobRequirementsNatively(html);
        expect(result).toEqual(jobRequirements)
      });
  });
});
