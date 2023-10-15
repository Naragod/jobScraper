import dotenv from "dotenv";
import { Channel, ConsumeMessage, connect } from "amqplib";

dotenv.config({ path: `.env.${process.env.ENVIRONMENT}` });
const { QUEUE_PORT, QUEUE_HOST } = process.env;

// tutorial
// https://www.rabbitmq.com/tutorials/tutorial-two-javascript.html

export const getChannel = async () => {
  const connection = await connect(`amqp://${QUEUE_HOST}:${QUEUE_PORT}`);
  return await connection.createChannel();
};

export const sendMessageToQueue = async (channel: Channel, queue: string, message: Object) => {
  channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
  console.log(`Sent: ${JSON.stringify(message)} to: ${queue}`);
};

export const consumeMessageFromQueue = async (
  channel: Channel,
  queue: string,
  callback: Function,
): Promise<ConsumeMessage | null> => {
  return await new Promise((resolve, reject) => {
    channel.consume(
      queue,
      async (message) => {
        console.log(`Waiting for message in queue: ${queue}`);
        const result = await callback(message).catch(reject);
        channel.ack(<any>message);
        resolve(result);
        console.log(`Consumed message: ${message?.content.toString()}`);
      },
      { noAck: false },
    );
    setTimeout(() => reject(new Error("Took too long to consume Message")), 10000);
  });
};
