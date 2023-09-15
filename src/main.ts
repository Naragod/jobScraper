import { applyToJobs as applyToJobsOnJobLever } from "./scrapers/jobLever/main";
import { applyToJobs as applytoJobsOnCanadaJobBoard } from "./scrapers/canadaJobBank/main";

// import { user as canadaJobBankUser, password as canadaJobBankPass } from "./config/canadaJobBank.config.json";

const COMPANIES = ["netflix", "eventbrite"];

const USER_DATA = {
  resume: "/home/mateo/Desktop/projects/localEmailClient/assets/resumes/DevRes.pdf",
  name: "Mateo Naranjo",
  email: "mateo.naranjo.barandica@gmail.com",
  phone: "647 366 8313",
  org: "N/A",
  "urls[Twitter]": "",
  "urls[GitHub]": "https://github.com/naragod",
  "urls[Portfolio]": "",
  "urls[Other]": "",
  comments: "",
  "urls[LinkedIn]": "https://www.linkedin.com/in/mateo-naranjo/",
};

const main = async () => {
  for (let company of COMPANIES) {
    await applyToJobsOnJobLever({ company });
  }
  await applytoJobsOnCanadaJobBoard({});
};

main();
