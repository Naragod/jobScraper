import { Observable } from "rxjs";
import { saveJobInfo } from "../database/main";
import { JobBoard } from "../scrapers/common/applicationHandler";
import { sleep } from "../utils/main";
import { getNativeNodeList } from "../utils/nativeHtmlTraversal";
import { consumeMessagesFromQueue, getChannel, sendMessageToQueue } from "./main";

export const queueJobLinks = async (queueName: string, jobBoardName: string, jobLinks: string[]) => {
  const channel = await getChannel();

  for (let link of jobLinks) await sendMessageToQueue(channel, queueName, { link, jobBoardName });
  await channel.close();
};

export const parseJobLinksFromQueue = async (jobBoard: JobBoard): Promise<Observable<any>> => {
  const { jobLinksQueue, getJobInformation, formatters, name: jobBoardName, throttleSpeed } = jobBoard;
  const channel = await getChannel();
  // assign a single task to a worker. If this is removed, all tasks will be assigned to the same worker
  await channel.prefetch(1);

  return await consumeMessagesFromQueue(channel, jobLinksQueue, async (message: any) => {
    const { link, jobBoardName: jbName } = JSON.parse(message.content.toString());

    if (jbName != jobBoardName) throw new Error(`Link: ${link} incompatible with parser: ${jobBoardName}`);
    const proxyOptions = { useProxy: <any>process.env.USE_PROXY, proxyCallType: "datacenter" as const };
    const html = await getNativeNodeList(link, "*", proxyOptions);
    const result = <any>getJobInformation(link, <any>html);
    await sleep(throttleSpeed);

    if (result == null) return;
    await saveJobInfo(result, formatters, jobBoardName);
  });
};
