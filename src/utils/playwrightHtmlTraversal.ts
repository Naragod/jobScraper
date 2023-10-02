import { flatten } from "./main";
import { Locator } from "playwright";

export const getTextContentList = async (locators: Locator[]) => {
  const textContentsRaw = await Promise.all(
    locators.reduce((prev: any, curr: any) => {
      const text = curr.innerText();
      return prev.concat(text).filter((item: any) => item != undefined);
    }, []),
  );
  return flatten(textContentsRaw);
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
  textContentIndex?: number,
): Promise<string | string[]> => {
  const content = await items[listItemIndex].locator(locate).all();
  const textContents = await getTextContentList(content);

  if (textContentIndex == undefined) return textContents;
  if (textContentIndex >= 0) return textContents[textContentIndex] || "";
  return textContents[textContents.length + textContentIndex] || "";
};
