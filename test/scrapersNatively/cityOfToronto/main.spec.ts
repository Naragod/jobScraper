import {
  getApplicationBasicInfoNatively,
  getJobRequirementsNatively,
} from "../../../src/scrapers/handlers/cityOfToronto/nativeParser";
import { getHTMLStringFromFile } from "../../../src/utils/io";
import { getLinkedDOMNode } from "../../../src/utils/nativeHtmlTraversal";
import { nurseApplication, techLeaderApplication, waterTechApplication, visualArtsApplication } from "./data/cityOfToronto_results.json";

describe("cityOfToronto Scraper", () => {
  describe("cityOfToronto Native Parser", () => {
    const link =
      "https://jobs.toronto.ca/jobsatcity/job/Toronto-CORPORATE-APPLICATION-TECHNICAL-LEADER-%28MS-Automation-Admin%29-ON-M5V-3C6/573144517/";

    describe("getApplicationBasicInfoNatively - city jobs", () => {
      it("usage - nurse posting", () => {
        const htmlString = getHTMLStringFromFile(
          "test/scrapersNatively/cityOfToronto/data/city_of_toronto_nurse_posting.html",
        );
        const html = getLinkedDOMNode(htmlString, ".job");
        const { location, ...result } = getApplicationBasicInfoNatively(link, html);
        expect(result).toEqual(nurseApplication.applicationInfo);
      }, 5000);

      it("usage - tech leader posting", () => {
        const htmlString = getHTMLStringFromFile(
          "test/scrapersNatively/cityOfToronto/data/city_of_toronto_tech_leader_posting.html",
        );
        const html = getLinkedDOMNode(htmlString, ".job");
        const result = getApplicationBasicInfoNatively(link, html);
        expect(result).toEqual(techLeaderApplication.applicationInfo);
      }, 5000);

      it("usage - water tech posting", () => {
        const htmlString = getHTMLStringFromFile(
          "test/scrapersNatively/cityOfToronto/data/city_of_toronto_water_tech_posting.html",
        );
        const html = getLinkedDOMNode(htmlString, ".job");
        const result = getApplicationBasicInfoNatively(link, html);
        expect(result).toEqual(waterTechApplication.applicationInfo);
      }, 5000);
    });

    describe("getApplicationBasicInfoNatively - recreation jobs", () => {
      it("usage - visual arts instructor posting", () => {
        const htmlString = getHTMLStringFromFile(
          "test/scrapersNatively/cityOfToronto/data/city_of_toronto_recreation_visital_arts_instructor_posting.html",
        );
        const html = getLinkedDOMNode(htmlString, "*");
        const recreationLink =
          "https://jobs.toronto.ca/recreation/job/Toronto-Visual-Arts-Instructor-%28DrawingPaintingPottery%29-North-York-District-ON/574939917/";
        const result = getApplicationBasicInfoNatively(recreationLink, html);
        expect(result).toEqual(visualArtsApplication.applicationInfo);
      }, 5000);
    });

    describe("getJobRequirementsNatively - recreation jobs", () => {
      it("usage - visual arts instructor posting", () => {
        const htmlString = getHTMLStringFromFile(
          "test/scrapersNatively/cityOfToronto/data/city_of_toronto_recreation_visital_arts_instructor_posting.html",
        );
        const html = getLinkedDOMNode(htmlString, "*");
        const result = getJobRequirementsNatively(html);
        expect(result).toEqual(visualArtsApplication.jobRequirements);
      }, 5000);
    });

    describe("getJobRequirementsNatively - city jobs", () => {
      it("usage - nurse posting", () => {
        const htmlString = getHTMLStringFromFile(
          "test/scrapersNatively/cityOfToronto/data/city_of_toronto_nurse_posting.html",
        );
        const html = getLinkedDOMNode(htmlString);
        const result = getJobRequirementsNatively(html);
        expect(result).toEqual(nurseApplication.jobRequirements);
      });

      it("usage - nurse posting", () => {
        const htmlString = getHTMLStringFromFile(
          "test/scrapersNatively/cityOfToronto/data/city_of_toronto_tech_leader_posting.html",
        );
        const html = getLinkedDOMNode(htmlString);
        const result = getJobRequirementsNatively(html);
        expect(result).toEqual(techLeaderApplication.jobRequirements);
      });
    });
  });
});
