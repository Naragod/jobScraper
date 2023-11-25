import { Page, chromium, Browser } from "playwright";

let browser: Browser | null;
export const getBrowserPage = async (options: any = {}): Promise<Page> => {
  const timeout = options.timeout || 1000 * 3;
  // Launch the browser and open a new blank page
  browser = browser || (await chromium.launch(options));
  const context = await browser.newContext();

  const page = await context.newPage();
  page.setDefaultTimeout(timeout);
  return page;
};

export const closeBrowser = async () => {
  if (browser == undefined || browser == null) return;
  await browser.close();
  browser = null;
};
