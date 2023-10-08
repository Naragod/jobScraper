import { scrapeJobs as scrapeJobsOnJobLever } from "./scrapers/jobLever/main";
import { scrapeJobs as scrapeJobsOnLinkedIn } from "./scrapers/linkedIn/main";
import { scrapeJobs as scrapeJobsOnCanadaJobBoard } from "./scrapers/canadaJobBank/main";
import { companies } from "./config/jobLever.config.json";
import { timeElapsed } from "./utils/main";

const main = async () => {
  console.log("ENVIRONMENT:", process.env.ENVIRONMENT);
  await timeElapsed(scrapeJobsOnLinkedIn, { searchTerm: "Software Engineer" }, 5);
  await timeElapsed(scrapeJobsOnCanadaJobBoard, { searchTerm: "software", location: "toronto" }, 5);
  await Promise.allSettled(
    companies.map(async (company) => await timeElapsed(scrapeJobsOnJobLever, { searchTerm: company }, 5)),
  );
  process.exit();
};

main().catch((err) => {
  console.log(err);
  process.exit(1);
});
