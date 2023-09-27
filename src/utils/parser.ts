/**
 *
 * @param str
 * @returns exlusively valid ASCII characters with the following exceptions: ’
 */
export const sanitizeString = (str: any) => {
  if (typeof str !== "string") return str;
  return str.replace(/[^\x00-\x7F\xA0’]+/gi, "").trim();
};
