import { Page } from "playwright";
import { JobInfoGetterFn } from "../executionSupport";
import { getApplicationBasicInfo, getApplicationEmailAddress, getJobRequirements } from "./parser";

export const getJobInformation: JobInfoGetterFn = async (link: string, page: Page) => {
  try {
    await page.goto(link);
    // basic info will always appear regardless of the job application type: Should go first.
    const applicationInfo = await getApplicationBasicInfo(page);
    if (applicationInfo.jobProvider !== "Job Bank") {
      const externalLink = await page.locator('[id="externalJobLink"]').getAttribute("href");
      return { err: "Job requires application on website", link, externalLink, applicationInfo, jobRequirements: {} };
    }

    const jobRequirements = await getJobRequirements(page);
    const { eAddressErr, emailAddresses } = await getApplicationEmailAddress(page);
    return { link, emailAddresses, applicationInfo, jobRequirements, err: eAddressErr };
  } catch (err) {
    return { link, applicationInfo: {}, jobRequirements: {}, err };
  }
};
