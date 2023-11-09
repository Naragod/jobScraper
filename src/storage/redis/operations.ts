import { redisCon } from "./main";

export const addToStackCache = async (stackId: string, content: string, options: any = {}) => {
  // ttl 24 hours
  const { ttl = 60 * 60 * 24 } = options;
  const connection = await redisCon();

  await connection.lPush(stackId, content);
  await connection.expire(stackId, ttl);
  console.log(`Succesfully inserted item to stack: ${stackId}`);
};

export const getAllElementsFromStack = async (stackId: string) => {
  const connection = await redisCon();
  const stackItems = await connection.lRange(stackId, 0, -1);
  return stackItems.map((item) => JSON.parse(item));
};
