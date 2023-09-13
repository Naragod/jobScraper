import { findElementsInNodeList, getNodeList } from "../htmlTraversal";

export const baseURL = "https://jobs.lever.co";

export const getAllJobPageLinks = async (
  company: string,
  location?: string,
  commitment?: string,
  worplaceType?: string
) => {
  let url = `${baseURL}/${company}`;
  url = worplaceType != undefined ? `${url}?worplaceType=${worplaceType}` : url;
  url = location != undefined ? `${url}?location=${encodeURIComponent(location)}` : url;
  url = commitment != undefined ? `${url}?commitment=${encodeURIComponent(commitment)}` : url;
  const jobEntries = await getNodeList(url, "[class*='posting-apply']");

  // return all links
  return findElementsInNodeList(jobEntries, "A").map((item: any) => item.href);
};
