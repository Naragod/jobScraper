import { CABaseURL, USABaseURL } from "../../config/indeed.config.json";
import { getAllInnerTextElements, getNativeNodeList } from "../../utils/nativeHtmlTraversal";
import { AllJobsLinksGetterFn, IJobSearchOptions } from "../common/interfaces";

export const getAllJobPageLinks: AllJobsLinksGetterFn = async (searchParams: IJobSearchOptions): Promise<string[]> => {
  const { searchTerm, location, commitment, age = 7, page = 0, country = "ca" } = searchParams;
  let baseURL = country == "ca" ? CABaseURL : USABaseURL;
  let url = `${baseURL}?q=${searchTerm}&fromage=${age}&start=${page * 10}`;

  url = location != undefined ? `${url}&l=${location}` : url;
  url = commitment != undefined ? `${url}&sc=0kf:jt(${commitment});` : url;
  const jobEntries = await getNativeNodeList(encodeURI(url), "*", {useProxy:true, proxyCallType: "unblocker"});
  console.log("url:", encodeURI(url));

  // return all links
  return getAllInnerTextElements(jobEntries, "*").map((item: any) => {
    console.log("item:", item);
    return new URL(item.href, baseURL).href;
  });
};
