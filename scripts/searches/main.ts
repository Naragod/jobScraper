import hash from "object-hash";
import { v4 as uuidv4 } from "uuid";
import { Scraper } from "../../src/scrapers/applicationHandler";
import { companies } from "../../src/config/jobLever.config.json";
import { ScraperHandler } from "../../src/scrapers/scraperHandler";

export const jobLeverReader = async () => {
  const scraperHandler = new ScraperHandler();
  const scraper = <Scraper>scraperHandler.getScrapers("jobLever");
  const requestidentifier = uuidv4();
  const parseOptions = { numOfWorkers: 1 };

  for (let company of companies) {
    await scraper.queueJobUrls({ searchTerm: company }, { requestidentifier, searchSize: 500 });
    await scraper.parseJobLinks(parseOptions);
  }
};

const main = async () => {
  await jobLeverReader();
};

main();
