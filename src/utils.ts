export const flatten = (arr: any[]): any[] => {
  return arr
    .reduce((prev, curr) => {
      return prev.concat(Array.isArray(curr) ? flatten(curr) : curr);
    }, [])
    .filter((item: any) => item != undefined && item != "");
};
