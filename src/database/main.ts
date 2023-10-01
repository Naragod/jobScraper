import { IJobInfo } from "../scrapers/common/interfaces";
import { sql } from "./db";

export const saveJobInfo = async (jobInfo: IJobInfo[], formatters: any) => {
  const { formatToJobInfoTableStructure, formatToJobRequirementsStructure } = formatters;

  await Promise.allSettled(
    jobInfo.map(async (job) => {
      const jobInfoStructure = formatToJobInfoTableStructure(job);
      const jobReqStructure = formatToJobRequirementsStructure(job);
      const job_information_id_raw: any = await sql`INSERT INTO job_information ${sql(jobInfoStructure)} returning id`;
      const job_requirements_id_raw: any = await sql`INSERT INTO job_requirements ${sql(jobReqStructure)} returning id`;
      const job_information_id = job_information_id_raw[0].id;
      const job_requirements_id = job_requirements_id_raw[0].id;
      await sql`INSERT INTO jobs ${sql({ job_information_id, job_requirements_id })}`;
    }),
  );
};
