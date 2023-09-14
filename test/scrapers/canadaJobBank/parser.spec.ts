import { readFileSync } from "fs";
// import { getJobRequirements } from "../../../src/scrapers/canadaJobBank/parser";

describe("CanadaJobBank - Parser", () => {
  // describe("getJobRequirements", () => {
  const file = readFileSync("test/test_data/canadaJobBank/page.html");
  it("usage", async () => {
    console.log("file:", file);
    expect(1).toEqual(1);

    // });
  });
});
