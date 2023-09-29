import { JSDOM } from "jsdom";
import { flatten } from "../utils/main";

const FILTERLIST = ["TEXT", "#text"];

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

export const findElementsInElement = (element: any, elementType: string): any[] => {
  if (element == null) return [];
  const arr = [...element.childNodes]
    .filter((child) => !FILTERLIST.includes(child.nodeName))
    .map((child) => {
      if (child.nodeName == elementType) return child;
      const grandChildren = findElementsInElement(child, elementType);

      if (grandChildren.length == 0) return;
      return grandChildren;
    });
  return flatten(arr);
};

/**
 * @example:<div> <span>hello</span> <div><span>world</span></div> </div>
 * Callingf indElementsInNodeList(nodeList, "SPAN") returns "SPAN"[].
 * A list of node elements of type span, regardless if they are nested will be returned.
 * @param nodeList
 * @param elementType
 * @returns Returns a flattened list of nodes having the elementType specified
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
 * @example: HTML: <h1>title</h1><p>paragraph</p>
 * Calling getElementAfter(nodeList, "P", "title") on the above HTML returns <p>paragraph</p> as this
 * is below <h1><title</h1> element
 * @param nodeList
 * @param elementType
 * @param elementContent
 * @returns Returns the node right after the searched for element.
 *
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

// specific implementation of getAllChildrenNodes which obtains all children textContent properties
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
