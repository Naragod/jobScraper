import { Page } from "playwright";
import { JobInfoGetterFn } from "../common/interfaces";
import { getApplicationBasicInfo, getJobRequirements, fillInApplication } from "../jobLever/parser";

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
