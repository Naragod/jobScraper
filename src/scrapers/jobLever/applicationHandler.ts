import { Page } from "playwright";
import { getApplicationBasicInfo, getJobRequirements, fillInApplication } from "../jobLever/parser";
import { JobInfoGetterFn } from "../executionSupport";

export const getJobInformation: JobInfoGetterFn = async (link: string, page: Page) => {
  try {
    await page.goto(link);
    const applicationInfo = await getApplicationBasicInfo(page);
    const jobRequirements = await getJobRequirements(page);
    return { link, applicationInfo, jobRequirements, err: false };
  } catch (err) {
    return { link, applicationInfo: {}, jobRequirements: [], err };
  }
};
