import { IJobInfo } from "../scrapers/common/interfaces";
import { sql } from "./db";

export const saveJobInfo = async (jobInfo: IJobInfo[], formatters: any) => {
  const { formatToJobInfoTableStructure, formatToJobRequirementsStructure } = formatters;
  const applicationInfoEntries: any[] = jobInfo.map(formatToJobInfoTableStructure);
  const jobRequirementEntries: any[] = jobInfo.map(formatToJobRequirementsStructure);

  await Promise.allSettled(
    applicationInfoEntries.map(async (job) => {
      await sql`INSERT INTO job_information ${sql(job)}`.catch(console.error);
    })
  );

  await Promise.allSettled(
    jobRequirementEntries.map(async (job) => {
      await sql`INSERT INTO job_requirements ${sql(job)}`.catch(console.error);
    })
  );
};
