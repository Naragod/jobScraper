import { parseHTML } from "linkedom";
import { flatten } from "./main";
import { sanitizeString } from "./parser";
import { superFetch } from "../proxy/main";
import { IProxyCallOptions } from "../scrapers/common/interfaces";

export const getLinkedDOMNode = (html: string, pattern = "*") => {
  const { document } = parseHTML(html);
  return document.querySelectorAll(pattern);
};

export const getNativeNodeList = async (
  url: string,
  pattern: string,
  options: IProxyCallOptions = { useProxy: false, proxyCallType: "datacenter" },
): Promise<NodeListOf<Element>> => {
  const htmlResponse = await superFetch(url, options);
  return getLinkedDOMNode(htmlResponse, pattern);
};

// can only get text of elements with children.
// a childless node will return an empty querySelectorAll array regardles of the pattern
export const getInnerText = (el: Element, regexes: RegExp[] = []): string[] => {
  const textArray: string[] = flatten(
    [...el.querySelectorAll(":not(script,style,.hidden)")].map((item) => {
      if (item.children.length == 0) return sanitizeString(item.textContent, regexes) || "";
      return getInnerText(item, regexes);
    }),
  );

  // Using el.textContent on a childless node is fine.
  if (textArray.length == 0) return [sanitizeString(el.textContent, regexes) || ""];
  // get all unique inputs from flattened array of strings.
  return [...new Set(textArray)];
};

export const executeCallbackOnNodeList = (nodeList: NodeListOf<Element>, pattern: string, callback: Function) => {
  const elements = [...nodeList][0].querySelectorAll(pattern);
  const result = [...elements].map((child, i: number) => callback(child, i)).filter((item) => item !== undefined);
  return [...new Set(result)];
};

// specific implementation of executeCallbackOnNodeList
export const getAllInnerTextElements = (nodeList: NodeListOf<Element>, pattern: string, regexes: RegExp[] = []) => {
  const callback = (child: Element) => getInnerText(child, regexes);
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
