import { Page } from "playwright";
import { getJSDOMNode, findElementsInNodeList } from "../../apiRequests/htmlTraversal";

export const getApplicationBasicInfo = async (page: Page) => {
  const headingDiv = await page.locator(".posting-headline");
  const title = await headingDiv.getByRole("heading").textContent();
  const location = await headingDiv.locator(".location").textContent();
  const department = await headingDiv.locator(".department").textContent();
  const commitment = await headingDiv.locator(".commitment").textContent();
  const workplaceTypes = await headingDiv.locator(".workplaceTypes").textContent();

  return {
    title,
    location,
    department,
    commitment,
    workplaceTypes,
  };
};
