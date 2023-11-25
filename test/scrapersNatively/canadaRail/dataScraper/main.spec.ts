import {
  getApplicationBasicInfoNatively,
  getJobRequirementsNatively,
} from "../../../../src/scrapers/canadaRail/nativeParser";
import { getHTMLStringFromFile } from "../../../../src/utils/io";
import { getLinkedDOMNode } from "../../../../src/utils/nativeHtmlTraversal";
import { applicationInfo, jobRequirements } from "./data/results.json";

describe("Canada Rail Scraper", () => {
  describe("Canada Rail Native Parser", () => {
    const _link = "https://cn360.csod.com/ux/ats/careersite/1/home/requisition/11820?c=cn360&lang=en-US";
    const htmlString = getHTMLStringFromFile("test/scrapersNatively/canadaRail/dataScraper/data/train_conductor.html");

    describe("getApplicationBasicInfoNatively", () => {
      it("usage", async () => {
        const html = getLinkedDOMNode(htmlString);
        const { description, ...result } = getApplicationBasicInfoNatively(html);
        const { description: expectedDescription, ...expectedResult } = applicationInfo;
        expect(result).toEqual(expectedResult);
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
