import { Page, chromium, Browser } from "playwright";

let browser: Browser;
export const getBrowserPage = async (options: any = {}): Promise<Page> => {
  const timeout = options.timeout || 5000;
  // Launch the browser and open a new blank page
  browser = await chromium.launch(options);
  const context = await browser.newContext();

  const page = await context.newPage();
  page.setDefaultTimeout(timeout);
  return page;
};

export const closeBrowser = async () => {
  await browser.close();
};
