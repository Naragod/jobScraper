import { v4 as uuidv4 } from "uuid";
import { Request, Response, Router } from "express";
import {
  searchJobs,
  parseJobs,
  searchJobsOn,
  parseJobsOn,
  scrapeNatively,
  scrapeJobsNativelyOn,
} from "../scrapers/main";

export const searchRouter = Router({ caseSensitive: true });

searchRouter.get("/", async (req: Request, res: Response) => {
  const { requestidentifier = uuidv4() } = req.headers;
  const { searchTerm, location, searchSize = 20, age = 7 } = req.query;
  console.log(requestidentifier);

  setTimeout(() => res.send("Search initated..."), 8000);

  searchJobs(<string>searchTerm, <any>location, <any>age, {
    searchSize: <any>searchSize,
    requestidentifier: <any>requestidentifier,
  });

  parseJobs({ numOfWorkers: 5 });
});

searchRouter.get("/searchnatively", async (req: Request, res: Response) => {
  let result: any = {};
  const { searchTerm, location, searchSize, age = 7, jobBoard } = req.query;

  if (jobBoard)
    result = await scrapeJobsNativelyOn(<string>jobBoard, <string>searchTerm, <any>location, <any>age, <any>searchSize);
  else result = await scrapeNatively(<string>searchTerm, <any>location, <any>age, <any>searchSize);

  return res.json(result);
});

searchRouter.get("/searchOn", async (req: Request, res: Response) => {
  const { requestidentifier = uuidv4() } = req.headers;
  const { jobBoard, searchTerm, location, searchSize, age = 7 } = req.query;

  await searchJobsOn(<string>jobBoard, <string>searchTerm, <any>location, <any>age, {
    searchSize: <any>searchSize,
    requestidentifier: <any>requestidentifier,
  });

  await parseJobsOn(<string>jobBoard, { numOfWorkers: 5 });

  return res.send("hitting the search endpoint");
});
