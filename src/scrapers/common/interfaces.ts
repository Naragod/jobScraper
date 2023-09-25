import { Page } from "playwright";

export interface IJobInfo {
  link: string;
  jobRequirements: any;
  applicationInfo: any;
  applicationInputFields?: any[];
  err: any;
}

export interface IApplicationQuestion {
  label: string;
  inputType: string;
  isRequired: boolean;
  inputFields: any[];
  err: any;
}

export interface IJobSearchOptions {
  location?: string;
  jobTitle?: string;
  company?: string;
  sort?: string;
  age?: number;
}

export interface JobInfoGetterFn {
  (link: string, page: Page): Promise<IJobInfo>;
}

export interface scrapeJobsFn {
  (searchParams: IJobSearchOptions, applicationLimit?: number): Promise<IJobInfo[]>;
}

export interface AllJobsLinksGetterFn {
  (searchParams: IJobSearchOptions): Promise<string[]>;
}
