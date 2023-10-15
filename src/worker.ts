import { timeElapsed } from "./utils/main";
import { parseJobs as parseJobsOnLinkedIn } from "./scrapers/linkedIn/main";
import { parseJobs as parseJobsOnJobLever } from "./scrapers/jobLever/main";
import { parseJobs as parseJobsOnCanadaJobBoard } from "./scrapers/canadaJobBank/main";
const main = async () => {
  console.log("ENVIRONMENT:", process.env.ENVIRONMENT);
  
  // canadaJobBoard
  // **************************************************************************
  await parseJobsOnCanadaJobBoard();

  // linkedIn
  // **************************************************************************
  await parseJobsOnLinkedIn();

  // jobLever
  // **************************************************************************
  await parseJobsOnJobLever();
};

main();
