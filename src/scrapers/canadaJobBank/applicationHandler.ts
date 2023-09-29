import { Page } from "playwright";
import { JobInfoGetterFn } from "../common/interfaces";
import { getApplicationBasicInfo, getJobRequirements } from "./parser";

export const getJobInformation: JobInfoGetterFn = async (link: string, page: Page) => {
  try {
    await page.goto(link);
    // basic info will always appear regardless of the job application type: Should go first.
    const applicationInfo = await getApplicationBasicInfo(page);

    if (applicationInfo.jobProvider !== "Job Bank") {
      const err = "Job requires application on website";
      const externalLink = await page.locator('[id="externalJobLink"]').getAttribute("href");
      return { link, applicationInfo, jobRequirements: {}, externalLink: externalLink || "", err };
    }
    const jobRequirements = await getJobRequirements(page);
    return { link, applicationInfo: applicationInfo, jobRequirements, err: false };
  } catch (err) {
    return { link, applicationInfo: {}, jobRequirements: {}, err };
  }
};
