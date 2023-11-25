import { Page } from "playwright";
import { sleep } from "../../../utils/main";
import { baseURL } from "../../../config/canadaRail.config.json";
import { getBrowserPage } from "../../playwrightBrowserSupport";
import { getLinkedDOMNode } from "../../../utils/nativeHtmlTraversal";
import { AllJobsLinksGetterFn, IJobSearchOptions } from "../../interfaces";

const ageMap: any = {
  1: "WithinOneDay",
  7: "WithinSevenDays",
  3: "WithinThreeDays",
  15: "WithinFifteenDays",
  30: "WithinThirtyDays",
  default: "WithinSevenDays",
};

const ageProxyMap = new Proxy(ageMap, {
  get(target, prop) {
    return prop in target ? target[prop] : target["default"];
  },
});

const getLinks = async (page: Page, pattern: string) => {
  const pageHTML = await page.innerHTML("*");
  const html = getLinkedDOMNode(pageHTML, pattern);
  return [...html].map((child: any) => `${baseURL}${child.href}`);
};

const getAllSearchLinks = async (page: Page, links: string[] = []): Promise<string[]> => {
  let newLinks = await getLinks(page, "[data-tag='displayJobTitle']");
  links = [...new Set([...links, ...newLinks])];

  if (!(await navigateToNextPage(page))) {
    let newLinks = await getLinks(page, "[data-tag='displayJobTitle']");
    return [...new Set([...links, ...newLinks])];
  }
  return await getAllSearchLinks(page, links);
};

const navigateToNextPage = async (page: Page) => {
  try {
    await page.getByRole("button", { name: /Next Page, .+/ }).click();
    return true;
  } catch (err) {
    return false;
  }
};

export const getAllJobPageLinks: AllJobsLinksGetterFn = async (searchParams: IJobSearchOptions): Promise<string[]> => {
  try {
    const page = await getBrowserPage();
    const { searchTerm = "", location, age } = searchParams;
    let url = `${baseURL}/ux/ats/careersite/1/home?c=cn360`;

    url = location !== undefined ? `${url}&lq=${location}` : url;
    url = searchTerm !== undefined ? `${url}&sq=${searchTerm}` : url;
    url = age !== undefined ? `${url}&date=${ageProxyMap[age]}` : url;

    await page.goto(url);
    await page.getByRole("button", { name: "Search" }).click();
    await sleep(1000);
    const links = await getAllSearchLinks(page);
    await page.close();
    return links;
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const test = async () => {
  await getAllJobPageLinks({ searchTerm: "Integration", location: "Alberta" });
};
