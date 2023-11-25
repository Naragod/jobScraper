import { Page } from "playwright";
import { JobInfoGetterFn, JobInfoGetterNativelyFn } from "../../interfaces";
import { getApplicationBasicInfo, getJobRequirements } from "./parser";
import { getApplicationBasicInfoNatively, getExternalLink, getJobRequirementsNatively } from "./nativeParser";

export const getJobInformation: JobInfoGetterFn = async (link: string, page: Page) => {
  try {
    await page.goto(link);
    // basic info will always appear regardless of the job application type: Should go first.
    const applicationInfo = await getApplicationBasicInfo(page);

    if (applicationInfo.jobProvider !== "Job Bank") {
      console.log("Job requires application on website");
      const externalLink = await page.locator('[id="externalJobLink"]').getAttribute("href");
      return { link, applicationInfo, jobRequirements: { tasks: [] }, externalLink: externalLink || "", err: false };
    }
    const jobRequirements = await getJobRequirements(page);
    return { link, applicationInfo: applicationInfo, jobRequirements, err: false };
  } catch (err) {
    return {
      link,
      applicationInfo: { title: "", location: "", company: "", pay: "" },
      jobRequirements: { tasks: [] },
      err,
    };
  }
};

export const getJobInformationNatively: JobInfoGetterNativelyFn = (link: string, html: NodeListOf<Element>) => {
  try {
    // basic info will always appear regardless of the job application type: Should go first.
    const applicationInfo = getApplicationBasicInfoNatively(html);

    if (applicationInfo.jobProvider !== "Job Bank") {
      console.log("Job requires application on website");
      applicationInfo["externalLink"] = getExternalLink(html);
      return { link, applicationInfo, jobRequirements: { tasks: [] }, err: false };
    }
    const jobRequirements = getJobRequirementsNatively(html);
    return { link, applicationInfo, jobRequirements, err: false };
  } catch (err) {
    console.error(err);
    const applicationInfo = { title: "", location: "", company: "", pay: "" };
    return { link, applicationInfo, jobRequirements: { tasks: [] }, err };
  }
};
