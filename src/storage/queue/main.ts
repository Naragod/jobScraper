import dotenv from "dotenv";
import { Channel, ConsumeMessage, connect } from "amqplib";
import { Observable, Subscriber } from "rxjs";
import { getRandomHashId } from "../../utils/main";

dotenv.config({ path: `.env.${process.env.ENVIRONMENT}` });
const { QUEUE_PORT, QUEUE_HOST, MAX_QUEUE_CONSUMERS } = process.env;

// tutorial
// https://www.rabbitmq.com/tutorials/tutorial-two-javascript.html

export const getChannel = async () => {
  const connection = await connect(`amqp://${QUEUE_HOST}:${QUEUE_PORT}`);
  return await connection.createChannel();
};

export const sendMessageToQueue = async (channel: Channel, queue: string, message: Object) => {
  await channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
  console.log(`Sent: ${JSON.stringify(message)} to: ${queue}`);
};

export const consumeMessagesFromQueue = async (channel: Channel, queue: string, callback: Function) => {
  const { consumerCount } = await channel.assertQueue(queue, { durable: true });

  return new Observable((subscriber) => {
    try {
      if (consumerCount >= <any>MAX_QUEUE_CONSUMERS) throw new Error("Maximum number of consumers reached.");
      const consumerTag = getRandomHashId();
      const channelOptions = { consumerTag, noAck: false };
      console.log(`------------ Creating Consumer: ${consumerTag} ------------`);
      channel.consume(
        queue,
        async (message) => {
          console.log(`Waiting for message in queue: ${queue}`);
          const result = await callback(message);
          
          channel.ack(<any>message);
          subscriber.next({ consumerTag, result });
          console.log(`Consumed message: ${message?.content.toString()}`);
        },
        channelOptions,
      );
    } catch (err: any) {
      console.log(`Consumer error on queue: ${queue}: ${err.message}`);
    }
  });
};

export const removeConsumer = async (channel: Channel, consumerTag: string) => await channel.cancel(consumerTag);
