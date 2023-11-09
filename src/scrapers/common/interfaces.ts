import { Page } from "playwright";

export interface IJobRequirements {
  tasks: string[];
  education?: string;
  experience?: string;
  languages?: string[];
  techExperience?: string[];
}

export interface IApplicationInfo {
  title: string;
  company: string;
  location: string;
  pay: string;
  description?: string;
  commitment?: string;
  workplaceType?: string;
  jobProvider?: string;
  department?: string;
  externalLink?: string;
  extra?: any;
}

export interface IJobInfo {
  link: string;
  applicationInfo: IApplicationInfo;
  jobRequirements: IJobRequirements;
  err: any;
}

export interface IJobInfoModified {
  link: string;
  applicationInfo: any;
  jobRequirements: any;
  err: any;
}

export interface IApplicationQuestion {
  label: string;
  inputType: string;
  isRequired: boolean;
  inputFields: any[];
  err: any;
}

export interface IProxyCallOptions {
  useProxy?: boolean;
  sessionId?: string;
  proxyCallType?: "datacenter" | "unblocker";
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
  country?: string;
}

export interface IMetadataSearchOptions {
  searchSize: number;
  requestidentifier: string;
}

export interface JobInfoGetterFn {
  (link: string, page: Page): Promise<IJobInfoModified>;
}

export interface JobInfoGetterNativelyFn {
  (link: string, pageContent: any): IJobInfo;
}

export interface scrapeJobsFn {
  (searchParams: IJobSearchOptions, applicationLimit?: number): Promise<IJobInfo[]>;
}

export interface AllJobsLinksGetterFn {
  (searchParams: IJobSearchOptions): Promise<string[]>;
}
