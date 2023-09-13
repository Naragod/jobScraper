export type TemplateType = "generic" | "software";
import genericEmailTemplate from "./generic.json";
import softwareEmailTemplate from "./software.json";

export const templateTypes = {
  generic: genericEmailTemplate,
  software: softwareEmailTemplate,
};
