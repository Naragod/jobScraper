// import { applyToJobs } from "./scrapers/canadaJobBank/main";
import { applyToJobs } from "./scrapers/jobLever/main";

const main = async () => {
  await applyToJobs("netflix");
};

main();
