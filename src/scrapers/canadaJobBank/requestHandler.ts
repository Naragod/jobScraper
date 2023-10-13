import { baseURL } from "../../config/canadaJobBank.config.json";
import { AllJobsLinksGetterFn, IJobSearchOptions } from "../common/interfaces";
import { findElementsInNodeList } from "../../utils/htmlTraversal";
import { getNativeNodeList } from "../../utils/nativeHtmlTraversal";

export const getAllJobPageLinks: AllJobsLinksGetterFn = async (searchParams: IJobSearchOptions): Promise<string[]> => {
  const { searchTerm, location, age = 7, page = 1, sort } = searchParams;
  const composedUrl = `${baseURL}/jobsearch/jobsearch`;
  const formattedSearchTerm = searchTerm.split(" ").join("+");
  let url = `${composedUrl}?searchstring=${formattedSearchTerm}`;

  url = age !== undefined ? `${url}&fage=${age}` : url;
  url = sort !== undefined ? `${url}&sort=${sort}` : url;
  url = page !== undefined ? `${url}&page=${page}` : url;
  url = location !== undefined ? `${url}&locationstring=${location}` : url;
  const jobEntries = await getNativeNodeList(url, "[id^='article-']");

  // return all links
  return findElementsInNodeList(jobEntries, "A")
    .map((item: any) => new URL(item.href, baseURL).href)
    .filter((item) => item !== new URL("/login", baseURL).href);
};
