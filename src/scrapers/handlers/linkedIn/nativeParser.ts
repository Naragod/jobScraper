import { flatten } from "../../../utils/main";
import {
  executeCallbackOnNodeList,
  getAllHrefLinks,
  getAllInnerTextElements,
  getInnerText,
} from "../../../utils/nativeHtmlTraversal";
import { IApplicationInfo } from "../../interfaces";

// constants
// ****************************************************************************
const REGEXES = [new RegExp("\n", "gi"), new RegExp("/", "g")];

export const getApplicationBasicInfoNatively = (link: string, html: NodeListOf<Element>): IApplicationInfo => {
  const title = flatten(getAllInnerTextElements(html, "h1.top-card-layout__title", REGEXES))[0];

  if (title == undefined) throw Error(`Page blocked: ${link}`);
  const pay = flatten(getAllInnerTextElements(html, ".compensation__salary", REGEXES))[0];
  const location = flatten(getAllInnerTextElements(html, ".topcard__flavor", REGEXES))[1];
  const company = flatten(getAllInnerTextElements(html, ".topcard__flavor A", REGEXES))[0];
  const companyLink = getAllHrefLinks(html, ".topcard__flavor A")[0];

  const miscelaneousInformation = getAllInnerTextElements(html, "li.description__job-criteria-item", REGEXES).reduce(
    (result, criteria) => {
      const [category, value] = criteria;
      result[category] = value;
      return result;
    },
    {},
  );
  return {
    title,
    company,
    location,
    pay: pay || "",
    extra: { companyLink, miscelaneousInformation },
    commitment: miscelaneousInformation["Employment type"],
  };
};

export const getJobRequirementsNatively = (html: NodeListOf<Element>) => {
  return { tasks: flatten(getAllInnerTextElements(html, ".show-more-less-html__markup", REGEXES)) };
};
