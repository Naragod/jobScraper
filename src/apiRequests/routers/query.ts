import { v4 as uuidv4 } from "uuid";
import { Request, Response, Router } from "express";
import { getJobsInfo } from "../../storage/database/main";
import { getAllElementsFromStack } from "../../storage/redis/operations";

export const queryRouter = Router({ caseSensitive: true });

queryRouter.get("/", async (req: Request, res: Response) => {
  const { requestidentifier = uuidv4() } = req.headers;

  const jobInfoList = await getAllElementsFromStack(<string>requestidentifier);

  return res.json({ jobInfoList, totalCount: jobInfoList.length });
});
