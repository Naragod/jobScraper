import { ScraperHandler } from "../../scrapers/scraperHandler";

export const scrapeNatively = async (
  searchTerm: string,
  location: string,
  age: number,
  searchSize = 100,
  jobBoards?: string[],
) => {
  let result: any = { totalCount: 0, jobInfoList: [] };
  const scraperHandler = new ScraperHandler();
  const scrapers = scraperHandler.getScrapers(jobBoards);

  for (let [_key, scraper] of Object.entries(scrapers)) {
    let jobInfoList = await scraper.scrapeJobsNatively({ searchTerm, location, age }, searchSize); // synchronous implementation
    result["totalCount"] += jobInfoList.length;
    result["jobInfoList"] = result["jobInfoList"].concat(jobInfoList);
  }
  return result;
};
