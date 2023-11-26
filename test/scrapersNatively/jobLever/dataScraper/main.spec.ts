import {
  getApplicationBasicInfoNatively,
  getJobRequirementsNatively,
} from "../../../../src/scrapers/handlers/jobLever/nativeParser";
import { getHTMLStringFromFile } from "../../../../src/utils/io";
import { getLinkedDOMNode } from "../../../../src/utils/nativeHtmlTraversal";
import { applicationInfo, jobRequirements, withoutJobReq } from "./data/netflix_results.json";

describe("JobLever Scraper", () => {
  describe("JobLever Native Parser", () => {
    const link = "https://jobs.lever.co/netflix/44912894-f070-4989-9f9f-92ffb2ed210a";
    const htmlString = getHTMLStringFromFile("test/scrapersNatively/jobLever/dataScraper/data/netflix_page.html");

    describe("getApplicationBasicInfoNatively", () => {
      it("usage", async () => {
        const html = getLinkedDOMNode(htmlString);
        const { description: resultDescription = [], ...resultBasicInfo } = getApplicationBasicInfoNatively(link, html);
        const { description, ...basicJobInformation } = applicationInfo;
        expect(resultBasicInfo).toEqual(basicJobInformation);
        expect(resultDescription.length).toEqual(description.length);
      });
    });

    describe("getJobRequirementsNatively", () => {
      it("usage", async () => {
        const html = getLinkedDOMNode(htmlString);
        const result = getJobRequirementsNatively(html);
        expect(result).toEqual(jobRequirements);
      });

      // it("without posting requirements", () => {
      //   // TODO: fix test
      //   const enablePageString = getHTMLStringFromFile("test/scrapersNatively/jobLever/data/enable_page.html");
      //   const html = getLinkedDOMNode(enablePageString);
      //   const result = getJobRequirementsNatively(html);
      //   expect(result).toEqual(withoutJobReq);
      // });
    });
  });
});
