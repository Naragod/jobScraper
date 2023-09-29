import { baseURL } from "../../config/jobLeverl.config.json";
import { AllJobsLinksGetterFn, IJobSearchOptions } from "../../scrapers/common/interfaces";
import { findElementsInNodeList, getNodeList } from "../../utils/htmlTraversal";

export const getAllJobPageLinks: AllJobsLinksGetterFn = async (searchParams: IJobSearchOptions) => {
  const { searchTerm, location, commitment, workplaceType } = searchParams;
  let url = `${baseURL}/${searchTerm}?`;
  url = workplaceType != undefined ? `${url}&workplaceType=${workplaceType}` : url;
  url = location != undefined ? `${url}&location=${encodeURIComponent(location)}` : url;
  url = commitment != undefined ? `${url}&commitment=${encodeURIComponent(commitment)}` : url;
  const jobEntries = await getNodeList(url, ".posting-apply");

  // return all links
  return findElementsInNodeList(jobEntries, "A").map((item: any) => item.href);
};
