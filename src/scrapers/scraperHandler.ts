import { JobBoard, Scraper } from "./applicationHandler";
import * as scraperConfigurations from "./handlers/main";
import { IMetadataSearchOptions, IScraperConfigurationOptions } from "./interfaces";

export class ScraperHandler {
  public scrapers: { [key: string]: Scraper } = {};

  constructor() {
    this.setupScrapers();
  }

  setupScrapers() {
    Object.keys(scraperConfigurations).map((key: any) => {
      const scraperConfiguration: IScraperConfigurationOptions = scraperConfigurations[key as keyof Object] as any;
      const { formatters, options, parsingFunctions } = scraperConfiguration;
      const canadaJobBoard = new JobBoard(parsingFunctions, formatters, options);
      this.scrapers[options.jobBoardName] = new Scraper(canadaJobBoard);
    });
  }

  getScrapers(scrapers?: string[]): { [scraperName: string]: Scraper } {
    if (scrapers == undefined) return this.scrapers;
    const result: { [key: string]: Scraper } = {};
    const scraperNames = Object.keys(this.scrapers);
    scrapers.map((scraper) => {
      if (!scraperNames.includes(scraper)) {
        console.error(`Invalid Scraper: ${scraper}`);
        return;
      }
      result[scraper] = this.scrapers[scraper];
    });
    return result;
  }

  async searchJobs(
    searchTerm: string,
    location: string,
    age: number,
    options: IMetadataSearchOptions,
    jobBoards?: string[],
  ) {
    const scrapers = this.getScrapers(jobBoards);

    for (let key of Object.keys(scrapers)) {
      const scraper: Scraper = scrapers[key as keyof Object] as any;
      await scraper.queueJobUrls({ searchTerm, location, age }, options);
    }
  }

  async parseJobs(options: any, jobBoards?: string[]) {
    const scrapers = this.getScrapers(jobBoards);

    for (let key of Object.keys(scrapers)) {
      const scraper: Scraper = scrapers[key as keyof Object] as any;
      await scraper.parseJobLinks(options);
    }
  }
}

export const test = () => {
  const aa = new ScraperHandler();
  console.log(aa.getScrapers());
};
