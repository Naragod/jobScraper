import { Page } from "playwright";
import { sleep } from "../../utils";
import { getBrowserPage } from "./browserSupport";

// configuration variables
// ****************************************************************************
// have a reasonable number of parallel processes.
// too many and it might be slower than too few
// too many processes creates more memory management work for the browser.
const CONCURRENT = 7;
const THROTTLE_SPEED = 50;

export interface IJobInfo {
  link: string;
  jobRequirements: any;
  applicationInfo: any;
  err: any;
}

export interface JobInfoGetterFn {
  (link: string, page: Page): Promise<IJobInfo>;
}

export const handleJobApplication = async (link: string, handler: JobInfoGetterFn, throttleSpeed: number) => {
  // create new page to query for job information in parallel
  const page = await getBrowserPage({ headless: true });
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
  concurrent = CONCURRENT,
  throttleSpeed = THROTTLE_SPEED
) => {
  const result = [];
  const promiseQueue = [];

  for (let link of jobLinks) {
    const func = () => handleJobApplication(link, handler, throttleSpeed);
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
