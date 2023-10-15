import { scrapeJobsNatively as scrapeJobsNativelyOnJobLever } from "./scrapers/jobLever/main";
import { scrapeJobsNatively as scrapeJobsNativelyOnLinkedIn } from "./scrapers/linkedIn/main";
import { scrapeJobsNatively as scrapeJobsNativelyOnCananaJobBoard } from "./scrapers/canadaJobBank/main";
import { companies } from "./config/jobLever.config.json";
import { timeElapsed } from "./utils/main";

const main = async () => {
  console.log("ENVIRONMENT:", process.env.ENVIRONMENT);
  // canadaJobBoard
  // **************************************************************************
  await timeElapsed(scrapeJobsNativelyOnCananaJobBoard, { searchTerm: "Software Engineer" }, 6); // synchronous implementation

  // linkedIn
  // **************************************************************************
  await timeElapsed(scrapeJobsNativelyOnLinkedIn, { searchTerm: "Software Engineer" }, 6); // synchronous implementation

  // jobLever
  // **************************************************************************
  for (let company of companies) {
    await timeElapsed(scrapeJobsNativelyOnJobLever, { searchTerm: company }, 6); // uses queues
  }
  process.exit();
};

main().catch((err) => {
  console.log(err);
  process.exit(1);
});
