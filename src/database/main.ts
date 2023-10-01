import { IJobInfo } from "../scrapers/common/interfaces";
import { sql } from "./db";

export const saveJobInfo = async (jobInfo: IJobInfo[], formatters: any) => {
  const { formatToJobInfoTableStructure, formatToJobRequirementsStructure } = formatters;

  await Promise.allSettled(
    jobInfo.map(async (job) => {
      try {
        const infoFormat = formatToJobInfoTableStructure(job);
        const jobReqFormat = formatToJobRequirementsStructure(job);
        const job_information_id_raw: any = await sql`INSERT INTO job_information ${sql(infoFormat)} returning id`;
        const job_requirements_id_raw: any = await sql`INSERT INTO job_requirements ${sql(jobReqFormat)} returning id`;
        const job_information_id = job_information_id_raw[0].id;
        const job_requirements_id = job_requirements_id_raw[0].id;
        await sql`INSERT INTO jobs ${sql({ job_information_id, job_requirements_id })}`;
      } catch (err) {
        console.error(err);
        return;
      }
    })
  );
};
