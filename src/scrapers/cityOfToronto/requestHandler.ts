import { Page } from "playwright";
import { recreationURL, cityURL, baseURL } from "../../config/cityOfToronto.config.json";
import { getLinkedDOMNode } from "../../utils/nativeHtmlTraversal";
import { AllJobsLinksGetterFn, IJobSearchOptions } from "../common/interfaces";
import { getBrowserPage } from "../common/playwrightBrowserSupport";

const expandList = async (page: Page, pattern: string) => {
  while (true) {
    try {
      await page.click(pattern);
    } catch (_e) {
      break;
    }
  }
};

const getLinks = async (page: Page, pattern: string) => {
  const pageHTML = await page.innerHTML("*");
  const domPage = getLinkedDOMNode(pageHTML, pattern);
  return [...new Set([...domPage].map((child: any) => `${baseURL}/${child.href}`))];
};

export const getAllJobPageLinks: AllJobsLinksGetterFn = async (searchParams: IJobSearchOptions): Promise<string[]> => {
  let result: string[] = [];
  const { searchTerm = "" } = searchParams;

  let citySearchUrl = `${cityURL}?q=${searchTerm}`;
  let recreationSearchUrl = `${recreationURL}?q=${searchTerm}`;
  const cityLinks = [citySearchUrl, recreationSearchUrl];
  const page = await getBrowserPage();

  for (let link of cityLinks) {
    page.goto(link);
    await expandList(page, "#tile-more-results");
    const links = await getLinks(page, "a.jobTitle-link");
    result = [...new Set(result.concat(links))];
  }
  await page.close()
  return result;
};
