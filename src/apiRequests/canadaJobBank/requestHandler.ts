import { findElementsInNodeList, getNodeList } from "../htmlTraversal";
import { baseURL } from "../../config/canadaJobBank.config.json";

type SortType = "D" | "M";

export const getAllJobPageLinks = async (
  jobTitle?: string,
  location?: string,
  age = 7, // Job should have been posted no more than `age` days ago
  page = 1,
  sort: SortType = "D"
): Promise<string[]> => {
  const composedUrl = `${baseURL}/jobsearch/jobsearch`;
  const url = `${composedUrl}?searchstring=${jobTitle}&locationstring=${location}&page=${page}&sort=${sort}&fage=${age}`;
  const jobEntries = await getNodeList(url, "[id^='article-']");

  // return all links
  return findElementsInNodeList(jobEntries, "A")
    .map((item: any) => `${baseURL}/${item.href}`)
    .filter((item) => item !== `${baseURL}/login`);
};
