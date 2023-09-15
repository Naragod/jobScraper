export const flatten = (arr: any[]): any[] => {
  return arr
    .reduce((prev, curr) => {
      return prev.concat(Array.isArray(curr) ? flatten(curr) : curr);
    }, [])
    .filter((item: any) => item != undefined && item != "");
};

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const timeElapsed = async (func: Function, ...args: any[]): Promise<any> => {
  const now = new Date().getTime();
  const result = await func.apply(null, args);
  const end = new Date().getTime();
  const secondsElapsed = Math.round((end - now) / 1000);
  const millisecondsElapsted = (end - now) % 1000;
  console.log(`${func.name} took ${secondsElapsed}.${millisecondsElapsted} seconds to execute.`);
  return { result, timeElapsed };
};
