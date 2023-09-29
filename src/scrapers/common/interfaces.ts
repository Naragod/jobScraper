import { Page } from "playwright";

export interface IJobInfo {
  link: string;
  applicationInfo: any;
  jobRequirements: any;
  applicationInputFields?: any[];
  externalLink?: string;
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
  searchTerm: string;
  age?: number;
  pay?: number;
  sort?: string;
  page?: number;
  location?: string;
  commitment?: string;
  workplaceType?: string | number;
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
