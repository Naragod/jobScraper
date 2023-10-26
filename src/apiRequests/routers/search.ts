import { Request, Response, Router } from "express";
import { searchJobs, parseJobs, searchJobsOn, parseJobsOn, scrapeNatively } from "../scrapers/main";

export const searchRouter = Router({ caseSensitive: true });

searchRouter.get("/", async (req: Request, res: Response) => {
  const { searchTerm, location, searchSize, age = 7 } = req.query;

  await searchJobs(<string>searchTerm, <any>location, <any>age, <any>searchSize);

  await parseJobs({ numOfWorkers: 5 });

  return res.send("hitting the search endpoint");
});

searchRouter.get("/searchnatively", async (req: Request, res: Response) => {
  const { searchTerm, location, searchSize, age = 7 } = req.query;

  await scrapeNatively(<string>searchTerm, <any>location, <any>age, <any>searchSize);

  return res.send("hitting the scrapeNatively endpoint");
});

searchRouter.get("/searchOn", async (req: Request, res: Response) => {
  const { jobBoard, searchTerm, location, searchSize, age = 7 } = req.query;

  await searchJobsOn(<string>jobBoard, <string>searchTerm, <any>location, <any>age, <any>searchSize);

  await parseJobsOn(<string>jobBoard, { numOfWorkers: 5 });

  return res.send("hitting the search endpoint");
});
