import dotenv from "dotenv";
import { Observable } from "rxjs";
import { sleep } from "../../utils/main";
import { saveJobInfo } from "../database/main";
import { JobBoard } from "../../scrapers/applicationHandler";
import { getNativeNodeList } from "../../utils/nativeHtmlTraversal";
import { consumeMessagesFromQueue, getChannel, sendMessageToQueue } from "./main";
import { addToStackCache } from "../redis/operations";

dotenv.config({ path: `.env.${process.env.ENVIRONMENT}` });
const { USE_PROXY = false } = process.env;

export const queueJobLinks = async (queueName: string, jobLinks: string[], messageMetaData: any) => {
  const channel = await getChannel();
  const { jobBoardName, requestidentifier } = messageMetaData;

  for (let link of jobLinks) await sendMessageToQueue(channel, queueName, { link, jobBoardName, requestidentifier });
  await channel.close();
};

export const parseJobLinksFromQueue = async (jobBoard: JobBoard): Promise<Observable<any>> => {
  const { jobLinksQueue, getJobInformation, formatters, name: jobBoardName, throttleSpeed } = jobBoard;
  const channel = await getChannel();
  // assign a single task to a worker. If this is removed, all tasks will be assigned to the same worker
  await channel.prefetch(1);

  return await consumeMessagesFromQueue(channel, jobLinksQueue, async (message: any) => {
    try {
      const { link, jobBoardName: jbName, requestidentifier } = JSON.parse(message.content.toString());

      if (jbName != jobBoardName) throw new Error(`Link: ${link} incompatible with parser: ${jobBoardName}`);
      const proxyOptions = { useProxy: USE_PROXY === "true", proxyCallType: "datacenter" as const };
      const html = await getNativeNodeList(link, "*", proxyOptions);
      const result = <any>getJobInformation(link, <any>html);
      await sleep(throttleSpeed);

      // save to long term storage postgres database
      if (result == null) return;
      const savedResult = await saveJobInfo(result, formatters, jobBoardName);

      // save to short term storage redis cache
      if (savedResult.length == 0) return;
      await addToStackCache(requestidentifier, JSON.stringify(result));
    } catch (err) {
      console.log(err);
      return;
    }
  });
};
