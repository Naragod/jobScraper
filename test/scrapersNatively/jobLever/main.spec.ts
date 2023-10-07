import { getApplicationBasicInfoNatively, getJobRequirementsNatively } from "../../../src/scrapers/jobLever/nativeParser";
import { getHTMLStringFromFile } from "../../../src/utils/io";
import { getLinkedDOMNode } from "../../../src/utils/nativeHtmlTraversal";
import { jobInformation, jobRequirements } from "./data/netflix_results.json";

describe("JobLever Scraper", () => {
  describe("Native Parser", () => {
    const link = "https://jobs.lever.co/netflix/44912894-f070-4989-9f9f-92ffb2ed210a";
    const htmlString = getHTMLStringFromFile("test/scrapersNatively/jobLever/data/netflix_page.html");

    it("getApplicationBasicInfoNatively - Usage", async () => {
      const html = getLinkedDOMNode(htmlString);
      const {description: resultDescription, ...resultBasicInfo} = getApplicationBasicInfoNatively(link, html);
      const { description, ...basicJobInformation } = jobInformation
      expect(resultBasicInfo).toEqual(basicJobInformation);
      expect(resultDescription.length).toEqual(description.length);
    });

    it("getJobRequirementsNatively - Usage", async () => {
        const html = getLinkedDOMNode(htmlString);
        const result = getJobRequirementsNatively(html);
        expect(result).toEqual(jobRequirements)
      });
  });
});
