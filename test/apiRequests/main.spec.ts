import { getAllJobPageLinks as getAllJobPageLinksIndeed } from "../../src/scrapers/indeed/requestHandler";
import { getAllJobPageLinks as getAllJobPageLinksLinkedIn } from "../../src/scrapers/linkedIn/requestHandler";
import { getAllJobPageLinks as getAllJobPageLinksJobLever } from "../../src/scrapers/jobLever/requestHandler";
import { getAllJobPageLinks as getAllJobPageLinksCanadaJobBank } from "../../src/scrapers/canadaJobBank/requestHandler";
import { getAllJobPageLinks as getAllJobPageLinksCityOfToronto } from "../../src/scrapers/cityOfToronto/requestHandler";

describe("getAllJobPageLinks", () => {
  it("LinkedIn - Usage", async () => {
    const searchParams = { searchTerm: "software developer" };
    const links = await getAllJobPageLinksLinkedIn(searchParams);
    expect(links.length).toEqual(25); // LinkedIn is very flakky.
  });

  it("CanadaJobBank - Usage", async () => {
    const searchParams = { searchTerm: "software developer" };
    const links = await getAllJobPageLinksCanadaJobBank(searchParams);
    expect(links.length).toEqual(25);
  });

  it("JobLever - Usage", async () => {
    const searchParams = { searchTerm: "tophat" };
    const links = await getAllJobPageLinksJobLever(searchParams);
    expect(links.length).toEqual(6); // This number is prone to change
  });

  it("Indeed - Usage", async () => {
    const searchParams = { searchTerm: "firefighter" };
    const links = await getAllJobPageLinksIndeed(searchParams);
    console.log("links:", links);
    expect(links.length).toEqual(6); // This number is prone to change
  });

  it("cityOfToronto - Usage", async () => {
    const searchParams = { searchTerm: "" };
    const links = await getAllJobPageLinksCityOfToronto(searchParams);
    console.log("links:", links);
    expect(links.length).toEqual(6); // This number is prone to change
  });
});
