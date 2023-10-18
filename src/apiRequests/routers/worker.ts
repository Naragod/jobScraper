import { Request, Response, Router } from "express";
import { parseJobs } from "../scrapers/main";

export const workerRouter = Router({ caseSensitive: true });

workerRouter.get("/", async (req: Request, res: Response) => {
  await parseJobs({ maxConsumers: 10 });

  return res.send("hitting the worker endpoint");
});
