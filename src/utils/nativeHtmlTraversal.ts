import { parseHTML } from "linkedom";
import { flatten, removeDuplicatesFromTwoDimArr } from "./main";
import { sanitizeString } from "./parser";

export const getLinkedDOMNode = (html: string, pattern = "*") => {
  const { document } = parseHTML(html);
  return document.querySelectorAll(pattern);
};

export const getNativeNodeList = async (url: string, pattern: string): Promise<NodeListOf<Element>> => {
  const response = await fetch(url);
  const htmlResponse = await response.text();
  return getLinkedDOMNode(htmlResponse, pattern);
};

// can only get text of elements with children.
// a childless node will return an empty querySelectorAll array regardles of the pattern
export const getInnerText = (el: Element): string[] => {
  const textArray: string[] = flatten(
    [...el.querySelectorAll(":not(script,style,.hidden)")].map((item) => {
      if (item.children.length == 0) return sanitizeString(item.textContent) || "";
      // if (item.children.length == 0) return item.textContent || "";
      return getInnerText(item);
    }),
  );

  // Using el.textContent on a childless node is fine.
  if (textArray.length == 0) return [el.textContent || ""];
  // get all unique inputs from flattened array of strings.
  return [...new Set(textArray)];
};

export const executeCallbackOnNodeList = (nodeList: NodeListOf<Element>, pattern: string, callback: Function) => {
  const result = [...nodeList]
    .map((node) => node.querySelectorAll(pattern))
    .map((items) => [...items].map((child) => callback(child)).filter((item) => item.length > 0))
    .filter((item) => item.length > 0);
  return removeDuplicatesFromTwoDimArr(result).flat();
};

// specific implementation of executeCallbackOnNodeList
export const getAllInnerTextElements = (nodeList: NodeListOf<Element>, pattern: string) => {
  const callback = (child: Element) => getInnerText(child);
  return executeCallbackOnNodeList(nodeList, pattern, callback);
};

export const getElementAfterNatively = (
  nodeList: NodeListOf<Element>,
  elementType: string,
  elementContent: string,
): any => {
  for (let index = 0; index < nodeList.length; index++) {
    const item = nodeList[index];

    if (item.children.length == 0) {
      if (item.nodeName != elementType) continue;
      if (item.textContent != elementContent) continue;
      if (index == nodeList.length) continue;
      return nodeList[index + 1];
    }
    const result = getElementAfterNatively(<any>item.children, elementType, elementContent);

    if (result != null) return result;
  }
  return null;
};

export const locator = (nodeList: NodeListOf<Element>, pattern: string) => {
  return [...nodeList].map((node) => node.querySelectorAll(pattern)).filter((item) => item.length > 0);
};
