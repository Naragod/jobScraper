import { getHTMLStringFromFile } from "../../../../src/utils/io";
import { applicationInfo, jobRequirements } from "./data/results.json";
import { getLinkedDOMNode } from "../../../../src/utils/nativeHtmlTraversal";
import {
  getApplicationBasicInfoNatively,
  getJobRequirementsNatively,
} from "../../../../src/scrapers/handlers/canadaRail/nativeParser";

describe("Canada Rail Scraper", () => {
  describe("Canada Rail Native Parser", () => {
    const _link = "https://cn360.csod.com/ux/ats/careersite/1/home/requisition/11811?c=cn360";
    const htmlString = getHTMLStringFromFile("test/scrapersNatively/canadaRail/dataScraper/data/raw_request.html");

    describe("getApplicationBasicInfoNatively", () => {
      it("usage", async () => {
        const html = getLinkedDOMNode(htmlString);
        const result = getApplicationBasicInfoNatively(html);
        expect(result).toEqual(applicationInfo);
      });
    });

    describe("getJobRequirementsNatively", () => {
      it("usage", async () => {
        const html = getLinkedDOMNode(htmlString);
        const { tasks } = getJobRequirementsNatively(html);
        const { tasks: expectedTasks } = jobRequirements;
        expect(tasks.length).toEqual(expectedTasks.length);
      });
    });
  });
});
