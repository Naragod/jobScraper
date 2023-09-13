export const flatten = (arr: any[], _ = undefined): any[] => {
  return arr
    .reduce((prev, curr) => {
      return prev.concat(Array.isArray(curr) ? flatten(curr) : curr);
    }, [])
    .filter((item: any) => item != undefined && item != "");
};
