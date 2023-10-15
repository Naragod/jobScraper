import { Request, Response, Router } from "express";
import { searchJobs, scrapeNatively } from "../scrapers/main";

export const searchRouter = Router({ caseSensitive: true });

searchRouter.get("/", async (req: Request, res: Response) => {
  const { searchTerm, location, searchSize, age = 7 } = req.query;

  await searchJobs(<string>searchTerm, <any>location, <any>age, <any>searchSize);

  return res.send("hitting the search endpoint");
});

searchRouter.get("/searchnatively", async (req: Request, res: Response) => {
  const { searchTerm, location, searchSize, age = 7 } = req.query;

  await scrapeNatively(<string>searchTerm, <any>location, <any>age, <any>searchSize);

  return res.send("hitting the scrapeNatively endpoint");
});
