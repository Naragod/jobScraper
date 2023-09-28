import { Page } from "playwright";
import { JobInfoGetterFn } from "../common/interfaces";
import { getApplicationBasicInfo, getJobRequirements, getInputFields } from "./parser";

export const getJobInformation: JobInfoGetterFn = async (link: string, page: Page) => {
  try {
    await page.goto(link);
    const jobRequirements = await getJobRequirements(page);
    const applicationInfo = await getApplicationBasicInfo(page);
    // call to getInputFields has to come last as it navigates to application page, losing previous context
    const applicationInputFields = await getInputFields(page);
    return { link, applicationInfo, jobRequirements, applicationInputFields, err: false };
  } catch (err) {
    return { link, applicationInfo: {}, jobRequirements: [], applicationInputFields: [], err };
  }
};
