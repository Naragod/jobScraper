const sanatizeBy = (input: string, regexes: any[]): string =>
  regexes.reduce((finalStr, regex) => finalStr.replace(regex, ""), input);

/**
 *
 * @param str
 * @returns exlusively valid ASCII characters with the following exceptions: ’
 */
export const sanitizeString = (str: any, regexes: RegExp[] = []): string => {
  if (typeof str !== "string") return str;
  regexes = [...new Set(regexes)];
  regexes.unshift(new RegExp(/[^\x00-\x7F\xA0’]/, "gi"));
  return sanatizeBy(str, regexes).trim();
};

export const removeExcessArrayItems = (arr: string[], currentIndex: number, limit: number) => {
  // if there are more items than the limit, remove the excess
  if (currentIndex + arr.length > limit) {
    const keep = limit - currentIndex;
    const startIndex = currentIndex % arr.length;
    return arr.slice(startIndex, startIndex + keep);
  }
  return arr;
};
