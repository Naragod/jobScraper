import { Page } from "playwright";
import { JobInfoGetterFn, JobInfoGetterNativelyFn } from "../common/interfaces";
import { getApplicationBasicInfo, getJobRequirements, getInputFields } from "./parser";
import { getApplicationBasicInfoNatively, getJobRequirementsNatively } from "./nativeParser";

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

export const getJobInformationNatively: JobInfoGetterNativelyFn = (link: string, html: NodeListOf<Element>) => {
  try {
    const jobRequirements = getJobRequirementsNatively(html);
    const applicationInfo = getApplicationBasicInfoNatively(link, html);
    return { link, applicationInfo, jobRequirements, err: false };
  } catch (err) {
    console.error(err);
    const applicationInfo = { title: "", location: "", company: "", pay: "" };
    return { link, applicationInfo, jobRequirements: { tasks: [] }, err };
  }
};
