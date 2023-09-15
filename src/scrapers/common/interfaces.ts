import { Page } from "playwright";

export interface IJobInfo {
  link: string;
  jobRequirements: any;
  applicationInfo: any;
  err: any;
}

export interface JobInfoGetterFn {
  (link: string, page: Page): Promise<IJobInfo>;
}
