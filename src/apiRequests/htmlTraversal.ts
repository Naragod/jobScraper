import { JSDOM } from "jsdom";
import { flatten } from "../utils";
import { Locator } from "playwright";

const filterList = ["TEXT", "#text"];

export const getJSDOMNode = (html: string, pattern = "*") => {
  const { window } = new JSDOM(html);
  return window.document.querySelectorAll(pattern);
};

export const getNodeList = async (url: string, pattern: string): Promise<NodeList> => {
  const response = await fetch(url);
  const htmlResponse = await response.text();
  return getJSDOMNode(htmlResponse, pattern);
};

export const getAllChildrenNodes = (node: any): any[] => {
  const arr = [...node.childNodes].map((child) => {
    if (child.childNodes.length == 0) return child;
    const grandChildren = getAllChildrenNodes(child);

    if (grandChildren.length == 0) return;
    return grandChildren;
  });
  return flatten(arr);
};

export const getAllTextFromChildNodes = (node: any, filter: string[] = []): string[] => {
  return getAllChildrenNodes(node)
    .map((item) => item.textContent)
    .filter((item) => !filter.includes(item));
};

export const findElementsInElement = (element: any, elementType: string): any[] => {
  if (element == null) return [];
  const arr = [...element.childNodes]
    .filter((child) => !filterList.includes(child.nodeName))
    .map((child) => {
      if (child.nodeName == elementType) return child;
      const grandChildren = findElementsInElement(child, elementType);

      if (grandChildren.length == 0) return;
      return grandChildren;
    });
  return flatten(arr);
};

/**
 * Returns a flattened list of nodes having the elementType specified
 *
 * Example: <div> <span>hello</span> <div><span>world</span></div> </div>
 *
 * findElementsInNodeList(nodeList, "SPAN") returns Node("SPAN")[] will returns a list of
 * node elements of type span, regardless if they are nested.
 */
export const findElementsInNodeList = (nodeList: NodeList, elementType: string): any[] => {
  const arr = [...nodeList].map((entry: any) =>
    [...entry.childNodes].map((child: any) => {
      if (child.nodeName == elementType) return child;
      if (child.childNodes.length > 0) return findElementsInElement(child, elementType);
    })
  );

  return flatten(arr);
};

/**
 * Returns the node right after the found element.
 *
 * Example: <h1>title</h1><p>paragraph</p>
 *
 * getElementAfter(nodeList, "P", "title") returns Node(<p>paragraph</p>) as this
 * happens to be right after the <h1><title</h1> element
 */
export const getElementAfter = (nodeList: NodeList, elementType: string, elementContent: string) => {
  for (let index = 0; index < nodeList.length; index++) {
    if (nodeList[index].nodeName != elementType) continue;
    if (nodeList[index].textContent != elementContent) continue;
    if (index == nodeList.length) continue;
    return nodeList[index + 1];
  }
  return null;
};

export const getTextContentList = async (locators: Locator[]) => {
  const textContentsRaw = await Promise.all(
    locators.reduce((prev: any, curr: any) => {
      const text = curr.textContent();
      return prev.concat(text).filter((item: any) => item != undefined);
    }, [])
  );
  return flatten(textContentsRaw);
};

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
