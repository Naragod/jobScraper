import { findElementsInNodeList, getNodeList } from "../htmlTraversal";

export const baseURL = "https://www.jobbank.gc.ca";

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
    .map((item: any) => item.href)
    .filter((item) => item !== "/login");
};

// const goToPage = async (url: string) => {
//   const jobsPage = "[class*='job-posting-content']";
//   const page = await getNodeList(`${baseURL}/${url}`, jobsPage);

//   const listElements = findElementsInNodeList(page, "SPAN").flat();
//   // we want to use textContent: https://www.microfocus.com/documentation/silk-test/200/en/silktestworkbench-help-en/SILKTEST-21EEFF3F-DIFFERENCEBETWEENTEXTCONTENTSINNERTEXTINNERHTML-REF.html
//   listElements.map((item: any) =>
//     console.log(item.textContent.replace(/\s/g, ""))
//   );
//   const buttonElements = findElementsInNodeList(page, "BUTTON").flat();
//   [...buttonElements].map((button) => {});
// };
