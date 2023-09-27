import { Locator } from "playwright";
import { flatten } from "../utils/main";
import { getAllChildrenNodes, getJSDOMNode, getTextContentList } from "./htmlTraversal";

// specific implementation of findGetAllChildrenNodes which obtains all children textContent properties
export const getAllTextFromChildNodes = (node: any, filter: string[] = [""]): string[] => {
  return getAllChildrenNodes(node)
    .map((item) => item.textContent)
    .filter((item) => !filter.includes(item));
};

// specific implementation of findElementsInNodeList, creates the JSDOMNode object for you
export const getAllTextFromHTMLContent = (html: string, pattern = "*", filter = [""]): string[] => {
  const jsdomNode = getJSDOMNode(html, pattern);
  const textContentArray = [...jsdomNode].map((item) => getAllTextFromChildNodes(item, filter));
  // get all unique inputs from flattened array of strings.
  return <string[]>[...new Set(flatten(textContentArray))];
};

/**
 *
 * @param items
 * @param locate
 * @param listItemIndex
 * @param textContentIndex
 * @returns a single string or array of strings containing the text content of the item being searched for
 *          in the original locator array
 */
export const getListItemTextContent = async (
  items: Locator[],
  locate: string,
  listItemIndex: number,
  textContentIndex?: number
): Promise<string | string[]> => {
  const content = await items[listItemIndex].locator(locate).all();
  const textContents = await getTextContentList(content);

  if (textContentIndex == undefined) return textContents;
  if (textContentIndex >= 0) return textContents[textContentIndex];
  return textContents[textContents.length + textContentIndex];
};
