import { Request, Response, Router } from "express";
import { parseJobs } from "../scrapers/main";

export const workerRouter = Router({ caseSensitive: true });

workerRouter.get("/", async (req: Request, res: Response) => {
  const { numOfWorkers } = req.query;

  await parseJobs({ numOfWorkers });

  return res.send("hitting the worker endpoint");
});
