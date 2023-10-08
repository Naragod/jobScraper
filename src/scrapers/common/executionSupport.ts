import { JobInfoGetterFn } from "./interfaces";
import { getBrowserPage } from "./playwrightBrowserSupport";
import { sleep } from "../../utils/main";

// configuration variables
// ****************************************************************************
// have a reasonable number of parallel processes.
// too many and it might be slower than too few
// too many processes creates more memory management work for the browser.
const CONCURRENT = 7;
const THROTTLE_SPEED = 50;

export const handleJobApplication = async (link: string, handler: JobInfoGetterFn, options: any = {}) => {
  const headless = options.headless || true;
  const throttleSpeed = options.throttleSpeed || THROTTLE_SPEED;
  // create new page to query for job information in parallel
  const page = await getBrowserPage({ headless });
  console.log("link:", link);
  const jobInfo = await handler(link, page);
  // close page to prevent memory leaks
  await page.close();
  await sleep(throttleSpeed);
  return jobInfo;
};

export const handleJobApplicationsInParallel = async (
  jobLinks: string[],
  handler: JobInfoGetterFn,
  options: any = {},
) => {
  const result = [];
  const jobsToRetry = [];
  const promiseQueue = [];
  const concurrent = options.concurrent || CONCURRENT;

  for (let link of jobLinks) {
    const func = () => handleJobApplication(link, handler, options);
    promiseQueue.push(func());

    if (promiseQueue.length >= concurrent) {
      const p = await promiseQueue.shift();

      if (p?.err == false) {
        result.push(p);
        continue;
      }
      jobsToRetry.push(p);
    }
  }
  const jobInformationList = await Promise.allSettled(promiseQueue);
  jobInformationList.map((resolvedP: any) => {
    if (resolvedP.value.err == false) {
      result.push(resolvedP.value);
      return;
    }
    jobsToRetry.push(resolvedP.value);
  });
  return { result, jobsToRetry };
};
