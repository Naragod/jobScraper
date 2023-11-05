import { getScraper as getJobLeverScraper } from "../../scrapers/jobLever/main";
import { getScraper as getJobsOnLinkedInScraper } from "../../scrapers/linkedIn/main";
import { getScraper as getCanadaJobBoardScraper } from "../../scrapers/canadaJobBank/main";
import { getScraper as getJobsOnCityOfTorontoScraper } from "../../scrapers/cityOfToronto/main";
import { Scraper } from "../../scrapers/common/applicationHandler";
import { IJobInfo } from "../../scrapers/common/interfaces";

const getScrapers = async (): Promise<{ [key: string]: Scraper }> => {
  const canadaJobBoardScraper = await getCanadaJobBoardScraper();
  const cityOfTorontoScraper = await getJobsOnCityOfTorontoScraper();
  const linkedInScraper = await getJobsOnLinkedInScraper();
  const jobLeverScraper = await getJobLeverScraper();

  return {
    canadaJobBoardScraper,
    cityOfTorontoScraper,
    linkedInScraper,
    jobLeverScraper,
  };
};

export const scrapeJobsNativelyOn = async (
  jobBoard: string,
  searchTerm: string,
  location: string,
  age: number,
  searchSize = 100,
) => {
  const scrapers = await getScrapers();
  const scraperName = `${jobBoard}Scraper`;
  const scraper = scrapers[`${scraperName}`];

  if (scraper == undefined) return { error: `Invalid Scraper: ${scraperName}` };
  const jobInfoList = await scraper.scrapeJobsNatively({ searchTerm, location, age }, searchSize);
  const result: any = { totalCount: jobInfoList.length };
  result[scraperName] = { count: jobInfoList.length, jobInfoList };
  return result;
};

export const scrapeNatively = async (searchTerm: string, location: string, age: number, searchSize = 100) => {
  let result: any = { totalCount: 0, jobInfoList: [] };
  const scrapers = await getScrapers();

  for (let [_key, scraper] of Object.entries(scrapers)) {
    let jobInfoList = await scraper.scrapeJobsNatively({ searchTerm, location, age }, searchSize); // synchronous implementation
    result["totalCount"] += jobInfoList.length;
    result["jobInfoList"] = result["jobInfoList"].concat(jobInfoList);
  }
  return result;
};

export const searchJobs = async (searchTerm: string, location: string, age: number, searchSize = 100) => {
  const scrapers = await getScrapers();

  for (let [_key, scraper] of Object.entries(scrapers)) {
    await scraper.queueJobUrls({ searchTerm, location, age }, searchSize); // uses queues
  }
};

export const parseJobs = async (options: any) => {
  const scrapers = await getScrapers();

  for (let [_key, scraper] of Object.entries(scrapers)) {
    await scraper.parseJobLinks(options);
  }
};

export const searchJobsOn = async (
  jobBoard: string,
  searchTerm: string,
  location: string,
  age: number,
  searchSize = 100,
) => {
  const scrapers = await getScrapers();
  const scraper = scrapers[`${jobBoard}Scraper`];

  if (scraper == undefined) throw new Error(`Invalid Scraper Name: ${scraper}`);
  await scraper.queueJobUrls({ searchTerm, location, age }, searchSize); // uses queues
};

export const parseJobsOn = async (jobBoard: string, options: any) => {
  const scrapers = await getScrapers();
  const scraper = scrapers[`${jobBoard}Scraper`];

  if (scraper == undefined) throw new Error(`Invalid Scraper Name: ${scraper}`);
  await scraper.parseJobLinks(options);
};
