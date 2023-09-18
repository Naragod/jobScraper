import { Page } from "playwright";

export interface IJobInfo {
  link: string;
  jobRequirements: any;
  applicationInfo: any;
  err: any;
}

export interface IApplicationQuestion {
  label: string;
  inputType: string;
  isRequired: boolean;
  inputFields?: any[]
  err: any;
}

export interface JobInfoGetterFn {
  (link: string, page: Page): Promise<IJobInfo>;
}

export interface ApplyToJobsFn {
  (searchParams: any, applicationLimit?: number): Promise<void>;
}

export interface AllJobsLinksGetterFn {
  (searchParams: any): Promise<string[]>;
}
