import { sleep } from "../../utils";
import { JobInfoGetterFn } from "./interfaces";
import { getBrowserPage } from "./browserSupport";

// configuration variables
// ****************************************************************************
// have a reasonable number of parallel processes.
// too many and it might be slower than too few
// too many processes creates more memory management work for the browser.
const CONCURRENT = 7;
const THROTTLE_SPEED = 50;

export const handleJobApplication = async (
  link: string,
  handler: JobInfoGetterFn,
  headless: boolean,
  throttleSpeed: number
) => {
  // create new page to query for job information in parallel
  const page = await getBrowserPage({ headless });
  const jobInfo = await handler(link, page);
  // close page to prevent memory leaks
  await page.close();
  console.log(jobInfo.link);
  await sleep(throttleSpeed);
  return jobInfo;
};

export const handleJobApplicationsInParallel = async (
  jobLinks: string[],
  handler: JobInfoGetterFn,
  options: any = {}
) => {
  const result = [];
  const promiseQueue = [];
  const headless = options.headless || true;
  const concurrent = options.concurrent || CONCURRENT;
  const throttleSpeed = options.throttleSpeed || THROTTLE_SPEED;

  for (let link of jobLinks) {
    const func = () => handleJobApplication(link, handler, headless, throttleSpeed);
    promiseQueue.push(func());

    if (promiseQueue.length >= concurrent) {
      const p = await promiseQueue.shift();
      result.push(p);
    }
  }
  const jobInformationList = await Promise.allSettled(promiseQueue);
  jobInformationList.map((resolvedP: any) => result.push(resolvedP.value));
  return result;
};
