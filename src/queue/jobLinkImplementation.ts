import { consumeMessageFromQueue, getChannel, sendMessageToQueue } from "./main";

export const queueJobLinks = async (queueName: string, jobBoardName: string, jobLinks: string[]) => {
  const channel = await getChannel();

  for (let link of jobLinks) await sendMessageToQueue(channel, queueName, { link, jobBoardName });
  await channel.close();
};
