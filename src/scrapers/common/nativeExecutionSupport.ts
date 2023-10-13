import { sleep, timeElapsed } from "../../utils/main";
import { getNativeNodeList } from "../../utils/nativeHtmlTraversal";

const handlerWrapper = async (link: string, options: any, callback: any) => {
  const { pattern = "*", throttleSpeed } = options;
  const pageHtml = await getNativeNodeList(link, pattern);
  const { result } = await timeElapsed(callback, link, pageHtml);

  if (throttleSpeed) await sleep(throttleSpeed);
  return result;
};

export const executeInParallel = async (jobLinks: string[], handler: any, options: any = {}) => {
  const result: any[] = [];
  const jobsToRetry = [];
  const promiseQueue = [];
  const { concurrent = 7 } = options;

  for (let link of jobLinks) {
    const func = () => handlerWrapper(link, options, handler);
    promiseQueue.push(func());

    if (promiseQueue.length >= concurrent) {
      const p: any = await promiseQueue.shift();

      if (p?.err == false) {
        result.push(p);
        continue;
      }
      jobsToRetry.push(p);
    }
  }
  (await Promise.allSettled(promiseQueue)).map((resolvedP: any) => {
    if (resolvedP.value.err == false) return result.push(resolvedP.value);
    jobsToRetry.push(resolvedP.value);
  });
  return { result, jobsToRetry };
};
