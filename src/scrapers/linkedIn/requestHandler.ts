import { baseURL } from "../../config/linkedIn.config.json";
import { AllJobsLinksGetterFn, IJobSearchOptions } from "../common/interfaces";
import { getNodeList } from "../../utils/htmlTraversal";

// searchTerm: software engineer
// location: Canada
// age: f_TPR=604800 -> 60 * 60 * 24 * 7 - less than a week
// workplaceType: f_JT=2%2C1 -> 2, 1 - onsite, remote
// pay: f_SB2=22
// i.e.: https://www.linkedin.com/jobs/search?keywords=Software%20Engineer&location=Canada&f_TPR=r604800&f_SB2=22&f_JT=F&f_WT=2%2C1&position=1&pageNum=0

// LinkedIn is very flakky. They seem to implement thorttling by IP. Sometimes I get search results, sometimes not.
export const getAllJobPageLinks: AllJobsLinksGetterFn = async (searchParams: IJobSearchOptions) => {
  const { searchTerm, location, commitment, workplaceType, pay, age = 7, page = 0 } = searchParams;
  let url = `${baseURL}?keywords=${searchTerm}&f_TPR=r${60 * 60 * 24 * age}&pageNum=${page}`;

  url = pay !== undefined ? `${url}&f_SB2=${pay}` : url;
  url = location != undefined ? `${url}&location=${location}` : url;
  url = commitment != undefined ? `${url}&f_JT=${commitment}` : url;
  url = workplaceType != undefined ? `${url}&f_WT=${workplaceType}` : url;
  const jobEntries = await getNodeList(encodeURI(url), ".base-card__full-link");

  // return all links
  return [...jobEntries].map((item: any) => item.href);
};
