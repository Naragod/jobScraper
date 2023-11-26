import { Request, Response, Router } from "express";
import { ScraperHandler } from "../../scrapers/scraperHandler";

export const workerRouter = Router({ caseSensitive: true });

workerRouter.get("/", async (req: Request, res: Response) => {
  const { numOfWorkers } = req.query;

  const scraperHandler = new ScraperHandler();
  await scraperHandler.parseJobs({ numOfWorkers });

  return res.send("hitting the worker endpoint");
});
