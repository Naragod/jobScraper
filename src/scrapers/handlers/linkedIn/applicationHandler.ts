import { Page } from "playwright";
import { getApplicationBasicInfo, getJobRequirements } from "./parser";
import { JobInfoGetterFn, JobInfoGetterNativelyFn } from "../../interfaces";
import { getJobRequirementsNatively, getApplicationBasicInfoNatively } from "./nativeParser";

export const getJobInformation: JobInfoGetterFn = async (link: string, page: Page) => {
  try {
    await page.goto(link);
    const jobRequirements = await getJobRequirements(page);
    const applicationInfo = await getApplicationBasicInfo(page);
    return { link, applicationInfo, jobRequirements, applicationInputFields: [], err: false };
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
