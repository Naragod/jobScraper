import crypto from "crypto";
import { sanitizeString } from "./sanitation";

export const flatten = (arr: any[]): any[] => {
  return arr
    .reduce((prev, curr) => {
      return prev.concat(Array.isArray(curr) ? flatten(curr) : sanitizeString(curr));
    }, [])
    .filter((item: any) => item != undefined && item != "");
};

export const destructureObj = (obj: any, destructureBy: any[]): any => {
  let result: any = {};
  let leftOvers: any = {};

  for (let key of Object.keys(obj)) {
    if (typeof obj[key] == "object") {
      let { result: rr, leftOvers: lo } = destructureObj(obj[key], destructureBy);
      result = { ...result, ...rr };
      leftOvers = { ...leftOvers, ...lo };
      continue;
    }
    if (destructureBy.includes(key)) {
      result[key] = obj[key];
      continue;
    }
    leftOvers[key] = obj[key];
  }
  return { result, leftOvers };
};

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const timeElapsed = async <T>(func: Function, ...args: any[]): Promise<{ result: T; time: number }> => {
  const start = new Date().getTime();
  const result = await func.apply(null, args);
  const end = new Date().getTime();
  const secondsElapsed = Math.round((end - start) / 1000);
  const millisecondsElapsted = (end - start) % 1000;
  console.log(`${func.name} took ${secondsElapsed}.${millisecondsElapsted} seconds to execute.`);
  return { result, time: end - start };
};

export const getRandomHashId = () => crypto.randomBytes(10).toString("hex");
