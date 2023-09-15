import { baseURL } from "../../config/canadaJobBank.config.json";
import { findElementsInNodeList, getNodeList } from "../htmlTraversal";
import { AllJobsLinksGetterFn } from "../../scrapers/common/interfaces";

export const getAllJobPageLinks: AllJobsLinksGetterFn = async (searchParams: any): Promise<string[]> => {
  const { jobTitle, location, age = 7, page = 1, sort } = searchParams;
  const composedUrl = `${baseURL}/jobsearch/jobsearch`;
  const url = `${composedUrl}?searchstring=${jobTitle}&locationstring=${location}&page=${page}&sort=${sort}&fage=${age}`;
  const jobEntries = await getNodeList(url, "[id^='article-']");

  // return all links
  return findElementsInNodeList(jobEntries, "A")
    .map((item: any) => new URL(item.href, baseURL).href)
    .filter((item) => item !== new URL("/login", baseURL).href);
};
