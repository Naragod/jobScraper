import { baseURL } from "../../config/canadaJobBank.config.json";
import { AllJobsLinksGetterFn, IJobSearchOptions } from "../../scrapers/common/interfaces";
import { findElementsInNodeList, getNodeList } from "../../utils/htmlTraversal";

export const getAllJobPageLinks: AllJobsLinksGetterFn = async (searchParams: IJobSearchOptions): Promise<string[]> => {
  const { searchTerm, location, age = 7, page = 1, sort } = searchParams;
  const composedUrl = `${baseURL}/jobsearch/jobsearch`;
  const url = `${composedUrl}?searchstring=${searchTerm}&locationstring=${location}&page=${page}&sort=${sort}&fage=${age}`;
  const jobEntries = await getNodeList(encodeURI(url), "[id^='article-']");

  // return all links
  return findElementsInNodeList(jobEntries, "A")
    .map((item: any) => new URL(item.href, baseURL).href)
    .filter((item) => item !== new URL("/login", baseURL).href);
};
