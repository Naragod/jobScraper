import { JobInfoGetterNativelyFn } from "../../interfaces";
import { getApplicationBasicInfoNatively, getJobRequirementsNatively } from "./nativeParser";

export const getJobInformationNatively: JobInfoGetterNativelyFn = (link: string, html: NodeListOf<Element>) => {
  try {
    // basic info will always appear regardless of the job application type: Should go first.
    const applicationInfo = getApplicationBasicInfoNatively(link, html);
    const jobRequirements = getJobRequirementsNatively(html);
    return { link, applicationInfo, jobRequirements, err: false };
  } catch (err) {
    console.error(err);
    const applicationInfo = { title: "", location: "", company: "", pay: "" };
    return { link, applicationInfo, jobRequirements: { tasks: [] }, err };
  }
};
