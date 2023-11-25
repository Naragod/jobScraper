import { Page } from "playwright";
import { getBrowserPage } from "../../playwrightBrowserSupport";
import { getLinkedDOMNode } from "../../../utils/nativeHtmlTraversal";
import { AllJobsLinksGetterFn, IJobSearchOptions } from "../../interfaces";
import { recreationURL, cityURL, baseURL } from "../../../config/cityOfToronto.config.json";

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
  try {
    let result: string[] = [];
    const { searchTerm = "" } = searchParams;

    let citySearchUrl = `${cityURL}?q=${searchTerm}`;
    let recreationSearchUrl = `${recreationURL}?q=${searchTerm}`;
    const cityLinks = [citySearchUrl, recreationSearchUrl];
    const page = await getBrowserPage();

    for (let link of cityLinks) {
      await page.goto(link);
      await expandList(page, "#tile-more-results");
      const links = await getLinks(page, "a.jobTitle-link");
      result = [...new Set(result.concat(links))];
    }
    await page.close();
    return result;
  } catch (err) {
    console.log(err);
    return [];
  }
};
