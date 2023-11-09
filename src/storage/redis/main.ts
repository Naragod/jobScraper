import dotenv from "dotenv";
import { createClient } from "redis";

dotenv.config({ path: `.env.${process.env.ENVIRONMENT}` });
const { REDIS_HOST, REDIS_PORT } = process.env;

export const redisCon = async () => {
  return await createClient({ url: `redis://${REDIS_HOST}:${REDIS_PORT}` }).connect();
};
