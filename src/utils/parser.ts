const sanatizeBy = (input: string, regexes: any[]) =>
  regexes.reduce((finalStr, regex) => finalStr.replace(regex, ""), input);

/**
 *
 * @param str
 * @returns exlusively valid ASCII characters with the following exceptions: ’
 */
export const sanitizeString = (str: any, regexes: RegExp[] = []) => {
  if (typeof str !== "string") return str;
  regexes.unshift(new RegExp(/[^\x00-\x7F\xA0’]+/, "gi"));
  return sanatizeBy(str, regexes).trim();
};
