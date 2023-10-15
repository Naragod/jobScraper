import { searchJobs as searchJobsOnLinkedIn } from "./scrapers/linkedIn/main";
import { searchJobs as searchJobsJobsOnJobLever } from "./scrapers/jobLever/main";
import { searchJobs as searchJobsOnCanadaJobBoad } from "./scrapers/canadaJobBank/main";
import { companies } from "./config/jobLever.config.json";
import { timeElapsed } from "./utils/main";

const main = async () => {
  const jobSearchSize = 50;
  console.log("ENVIRONMENT:", process.env.ENVIRONMENT);

  // canadaJobBoard
  // **************************************************************************
  await timeElapsed(searchJobsOnCanadaJobBoad, { searchTerm: "software", location: "toronto" }, jobSearchSize); // uses queues

  // linkedIn
  // **************************************************************************
  await timeElapsed(searchJobsOnLinkedIn, { searchTerm: "lawyer" }, jobSearchSize); // uses queues

  // jobLever
  // **************************************************************************
  for (let company of companies) {
    await timeElapsed(searchJobsJobsOnJobLever, { searchTerm: company }, jobSearchSize); // uses queues
  }
  process.exit();
};

main().catch((err) => {
  console.log(err);
  process.exit(1);
});
