import { IJobInfo } from "../scrapers/common/interfaces";
import { sql } from "./db";

export const saveJobInfo = async (jobInfo: IJobInfo[], formatters: any, jobBoard: string) => {
  const { formatToJobInfoTableStructure, formatToJobRequirementsStructure } = formatters;
  const promises = jobInfo.map((job) => {
    try {
      const infoFormat = formatToJobInfoTableStructure(job);
      const jobReqFormat = formatToJobRequirementsStructure(job);
      return sql.begin(async (sql) => {
        const jobInfoRawId: any = await sql`INSERT INTO job_information ${sql(infoFormat)} returning id`;
        const jobReqRawId: any = await sql`INSERT INTO job_requirements ${sql(jobReqFormat)} returning id`;
        const job_information_id = jobInfoRawId[0].id;
        const job_requirements_id = jobReqRawId[0].id;
        await sql`INSERT INTO jobs ${sql({ job_board: jobBoard, job_information_id, job_requirements_id })}`;
      });
    } catch (err) {
      console.log("Failed on job:", job);
      console.error(err);
      return;
    }
  });

  return await Promise.allSettled(promises);
};
