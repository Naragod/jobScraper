import { Channel, ConsumeMessage, connect } from "amqplib";

// tutorial
// https://www.rabbitmq.com/tutorials/tutorial-two-javascript.html

export const getChannel = async () => {
  const connection = await connect({ protocol: "amqp", hostname: "localhost" });
  return await connection.createChannel();
};

export const sendMessageToQueue = async (channel: Channel, queue: string, message: Object) => {
  channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
  console.log(`Sent: ${JSON.stringify(message)} to: ${queue}`);
};

export const consumeMessage = async (
  channel: Channel,
  queue: string,
  callback: Function,
): Promise<ConsumeMessage | null> => {
  return await new Promise((resolve, reject) => {
    channel.consume(
      queue,
      (message) => {
        console.log(`Waiting for message in queue: ${queue}`);
        channel.ack(<any>message);
        resolve(callback(message));
      },
      { noAck: false },
    );
    setTimeout(() => reject(new Error("Took too long to consume Message")), 10000);
  });
};

export const consumeMessages = async (channel: Channel, queue: string, callback: Function = () => {}) => {
  let result: any[] = [];
  let { messageCount } = await channel.assertQueue(queue, { durable: true });
  // receive at most 1 message.
  await channel.prefetch(1);

  while (messageCount > 0) {
    const msg = await consumeMessage(channel, queue, callback);
    messageCount = (await channel.checkQueue(queue)).messageCount;
    result.push(msg);
  }
  return result;
};
