import { JobBoard, Scraper } from "./applicationHandler";
import * as scraperConfigurations from "./handlers/main";
import { IScraperConfigurationOptions } from "./interfaces";

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

  getScrapers(scraper?: string): { [scraperName: string]: Scraper } | Scraper {
    if (scraper) return this.scrapers[scraper];
    return this.scrapers;
  }
}

export const test = () => {
  const aa = new ScraperHandler();
  console.log(aa.getScrapers());
}; 

test();
