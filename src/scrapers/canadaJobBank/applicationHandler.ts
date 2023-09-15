import { Page } from "playwright";
import { baseURL } from "../../config/canadaJobBank.config.json";
import { getApplicationBasicInfo, getApplicationEmailAddress, getJobRequirements } from "./parser";
import { sleep } from "../../utils";
import { getBrowserPage } from "../browserSupport";

// configuration variables
// ****************************************************************************
// have a reasonable number of parallel processes.
// too many and it might be slower than too few
// too many processes creates more memory management work for the browser.
const CONCURRENT = 7;
const THROTTLE_SPEED = 50;

export const getJobInformation = async (link: string, page: Page) => {
  try {
    await page.goto(link);
    // basic info will always appear regardless of the job application type: Should go first.
    const applicationInfo = await getApplicationBasicInfo(page);
    if (applicationInfo.jobProvider !== "Job Bank") {
      const externalLink = await page.locator('[id="externalJobLink"]').getAttribute("href");
      return { err: "Job requires application on website", link, externalLink, applicationInfo };
    }

    const jobRequirements = await getJobRequirements(page);
    const { eAddressErr, emailAddresses } = await getApplicationEmailAddress(page);
    return { link, emailAddresses, applicationInfo, jobRequirements, err: eAddressErr };
  } catch (err) {
    return { err: err };
  }
};

const handleApplication = async (link: string, throttleSpeed: number) => {
  // create new page to query for job information in parallel
  const page = await getBrowserPage({ headless: true });
  const jobInfo = await getJobInformation(`${baseURL}/${link}`, page);
  // close page to prevent memory leaks
  await page.close();
  console.log(jobInfo.link);
  await sleep(throttleSpeed);
  return jobInfo;
};

export const handleJobApplicationsInParallel = async (
  jobLinks: string[],
  concurrent = CONCURRENT,
  throttleSpeed = THROTTLE_SPEED
) => {
  const result = [];
  const promiseQueue = [];

  for (let link of jobLinks) {
    const func = () => handleApplication(link, throttleSpeed);
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
