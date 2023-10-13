import {
  searchJobs as searchJobsJobsOnJobLever,
  scrapeJobsNatively as scrapeJobsNativelyOnJobLever,
} from "./scrapers/jobLever/main";
import {
  searchJobs as searchJobsOnLinkedIn,
  scrapeJobsNatively as scrapeJobsNativelyOnLinkedIn,
} from "./scrapers/linkedIn/main";
import {
  searchJobs as searchJobsOnCanadaJobBoad,
  scrapeJobsNatively as scrapeJobsNativelyOnCananaJobBoard,
} from "./scrapers/canadaJobBank/main";
import { companies } from "./config/jobLever.config.json";
import { timeElapsed } from "./utils/main";

const main = async () => {
  console.log("ENVIRONMENT:", process.env.ENVIRONMENT);
  // canadaJobBoard
  // **************************************************************************
  await timeElapsed(searchJobsOnCanadaJobBoad, { searchTerm: "software", location: "toronto" }, 6); // uses queues
  // await timeElapsed(scrapeJobsNativelyOnCananaJobBoard, { searchTerm: "Software Engineer" }, 6); // synchronous implementation

  // linkedIn
  // **************************************************************************
  await timeElapsed(searchJobsOnLinkedIn, { searchTerm: "Software Engineer" }, 6); // uses queues
  // await timeElapsed(scrapeJobsNativelyOnCananaJobBoard, { searchTerm: "Software Engineer" }, 6); // synchronous implementation

  // jobLever
  // **************************************************************************
  for (let company of companies) {
    await timeElapsed(searchJobsJobsOnJobLever, { searchTerm: company }, 6); // uses queues
    // await timeElapsed(scrapeJobsNativelyOnLinkedIn, { searchTerm: company }, 6); // synchronous implementation
  }
  process.exit();
};

main().catch((err) => {
  console.log(err);
  process.exit(1);
});
