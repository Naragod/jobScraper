import { scrapeJobs as scrapeJobsOnJobLever } from "./scrapers/jobLever/main";
import { scrapeJobs as scrapeJobsOnLinkedIn } from "./scrapers/linkedIn/main";
import { scrapeJobs as scrapeJobsOnCanadaJobBoard } from "./scrapers/canadaJobBank/main";

const COMPANIES = [
  "netflix",
  // "eventbrite",
  // "wealthsimple",
  // "1password",
  // "Horizon",
  // "waabi",
  // "Plooto",
  // "acquird",
  // "tophat",
  // "composer",
  // "medium",
  // "15five",
  // "360learning",
  // "bosonai",
  // "ada",
  // "truerank"
];

const main = async () => {
  const linkedInJobs = await scrapeJobsOnLinkedIn({ searchTerm: "Software Engineer" }, 5);
  const canadaBoardJobs = await scrapeJobsOnCanadaJobBoard({ searchTerm: "software", location: "toronto" }, 5);
  let jobLeverJobs = await Promise.allSettled(
    COMPANIES.map((company) => scrapeJobsOnJobLever({ searchTerm: company }, 5)),
  ).catch(console.error);
  process.exit();
};

main();
