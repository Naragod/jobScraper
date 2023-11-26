import { v4 as uuidv4 } from "uuid";
import { Request, Response, Router } from "express";
import { scrapeNatively } from "../scrapers/main";
import { ScraperHandler } from "../../scrapers/scraperHandler";

const scraperHandler = new ScraperHandler();
export const searchRouter = Router({ caseSensitive: true });

searchRouter.get("/", async (req: Request, res: Response) => {
  const { requestidentifier = uuidv4() } = req.headers;
  console.log(requestidentifier);

  const { searchTerm, location, searchSize = 20, age = 7, jobBoards: rawJobBoards } = req.query;
  try {
    let jobBoards = rawJobBoards !== undefined ? JSON.parse(<string>rawJobBoards) : undefined;

    setTimeout(() => res.status(200).send("Search initated..."), 5000);

    scraperHandler.searchJobs(
      <string>searchTerm,
      <any>location,
      <any>age,
      {
        searchSize: <any>searchSize,
        requestidentifier: <any>requestidentifier,
      },
      <string[]>jobBoards,
    );

    await scraperHandler.parseJobs({ numOfWorkers: 5 });
  } catch (err) {
    console.error(err);
    return res.status(400).send("Search Failed. Inccorect request.");
  }
});

searchRouter.get("/searchnatively", async (req: Request, res: Response) => {
  const { searchTerm, location, searchSize, age = 7, jobBoards: rawJobBoards } = req.query;
  let jobBoards = rawJobBoards !== undefined ? JSON.parse(<string>rawJobBoards) : undefined;

  const result = await scrapeNatively(
    <string>searchTerm,
    <string>location,
    <any>age,
    <any>searchSize,
    <string[]>jobBoards,
  );

  return res.json(result);
});
