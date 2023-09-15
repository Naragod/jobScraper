import { baseURL } from "../../config/jobLeverl.config.json";
import { AllJobsLinksGetterFn } from "../../scrapers/common/interfaces";
import { findElementsInNodeList, getNodeList } from "../htmlTraversal";

export const getAllJobPageLinks: AllJobsLinksGetterFn = async (searchParams: any) => {
  const { company, location, commitment, worplaceType } = searchParams;
  let url = `${baseURL}/${company}`;
  url = worplaceType != undefined ? `${url}?worplaceType=${worplaceType}` : url;
  url = location != undefined ? `${url}?location=${encodeURIComponent(location)}` : url;
  url = commitment != undefined ? `${url}?commitment=${encodeURIComponent(commitment)}` : url;
  const jobEntries = await getNodeList(url, "[class*='posting-apply']");

  // return all links
  return findElementsInNodeList(jobEntries, "A").map((item: any) => item.href);
};
