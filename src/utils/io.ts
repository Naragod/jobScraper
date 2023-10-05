import { readFileSync } from "fs";
import { resolve } from "path";

export const getHTMLStringFromFile = (filePath: string) => {
  return readFileSync(resolve(filePath), "utf-8");
};
