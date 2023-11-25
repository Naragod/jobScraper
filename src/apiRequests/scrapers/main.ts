import { Scraper } from "../../scrapers/applicationHandler";
import { IMetadataSearchOptions } from "../../scrapers/interfaces";
import { ScraperHandler } from "../../scrapers/scraperHandler";

export const scrapeJobsNativelyOn = async (
  jobBoard: string,
  searchTerm: string,
  location: string,
  age: number,
  searchSize = 100,
) => {
  const scraperHandler = new ScraperHandler();
  const scraper = <Scraper>scraperHandler.getScrapers(jobBoard);

  if (scraper == undefined) return { error: `Invalid Scraper: ${jobBoard}` };
  const jobInfoList = await scraper.scrapeJobsNatively({ searchTerm, location, age }, searchSize);
  const result: any = { totalCount: jobInfoList.length };
  result[jobBoard] = { count: jobInfoList.length, jobInfoList };
  return result;
};

export const scrapeNatively = async (searchTerm: string, location: string, age: number, searchSize = 100) => {
  let result: any = { totalCount: 0, jobInfoList: [] };
  const scraperHandler = new ScraperHandler();
  const scrapers = scraperHandler.getScrapers();

  for (let [_key, scraper] of Object.entries(scrapers)) {
    let jobInfoList = await scraper.scrapeJobsNatively({ searchTerm, location, age }, searchSize); // synchronous implementation
    result["totalCount"] += jobInfoList.length;
    result["jobInfoList"] = result["jobInfoList"].concat(jobInfoList);
  }
  return result;
};

export const searchJobs = async (
  searchTerm: string,
  location: string,
  age: number,
  options: IMetadataSearchOptions,
) => {
  const scraperHandler = new ScraperHandler();
  const scrapers = scraperHandler.getScrapers();

  for (let [_key, scraper] of Object.entries(scrapers)) {
    await scraper.queueJobUrls({ searchTerm, location, age }, options); // uses queues
  }
};

export const parseJobs = async (options: any) => {
  const scraperHandler = new ScraperHandler();
  const scrapers = scraperHandler.getScrapers();

  for (let [_key, scraper] of Object.entries(scrapers)) {
    await scraper.parseJobLinks(options);
  }
};

export const searchJobsOn = async (
  jobBoard: string,
  searchTerm: string,
  location: string,
  age: number,
  options: IMetadataSearchOptions,
) => {
  const scraperHandler = new ScraperHandler();
  const scraper = <Scraper>scraperHandler.getScrapers(jobBoard);

  if (scraper == undefined) throw new Error(`Invalid Scraper Name: ${scraper}`);
  await scraper.queueJobUrls({ searchTerm, location, age }, options); // uses queues
};

export const parseJobsOn = async (jobBoard: string, options: any) => {
  const scraperHandler = new ScraperHandler();
  const scraper = <Scraper>scraperHandler.getScrapers(jobBoard);

  if (scraper == undefined) throw new Error(`Invalid Scraper Name: ${scraper}`);
  await scraper.parseJobLinks(options);
};
