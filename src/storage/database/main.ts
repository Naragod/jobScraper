import { IJobInfo } from "../../scrapers/common/interfaces";
import { sql } from "./db";

export const saveJobsInfo = async (jobInfo: IJobInfo[], formatters: any, jobBoard: string) => {
  let result: any[] = [];

  for (let job of jobInfo) {
    const jobIds = await saveJobInfo(job, formatters, jobBoard);
    result.push(jobIds);
  }
  return result;
};

export const saveJobInfo = async (job: IJobInfo, formatters: any, jobBoard: string) => {
  const { formatToJobInfoTableStructure, formatToJobRequirementsStructure } = formatters;
  try {
    const infoFormat = formatToJobInfoTableStructure(job);
    const jobReqFormat = formatToJobRequirementsStructure(job);
    return await sql.begin(async (sql) => {
      const jobInfoRawId: any = await sql`INSERT INTO job_information ${sql(infoFormat)} returning id`;
      const jobReqRawId: any = await sql`INSERT INTO job_requirements ${sql(jobReqFormat)} returning id`;
      const job_information_id = jobInfoRawId[0].id;
      const job_requirements_id = jobReqRawId[0].id;
      const insertedIds = await sql`INSERT INTO jobs ${sql({
        job_board: jobBoard,
        job_information_id,
        job_requirements_id,
      })} RETURNING id`;
      return insertedIds.map((item) => item.id);
    });
  } catch (err: any) {
    if (err.code == 23505) {
      console.log("Duplicate key contraint violated. Record already exists, continuing.");
      return [];
    }
    console.log("Failed on job:", job, err);
    throw err;
  }
};

export const getJobsInfo = async (searchTerm: string, location: string, limit = 10) => {
  return await sql`SELECT * FROM jobs_info_view WHERE title ILIKE ${"%" + searchTerm + "%"} LIMIT ${limit}`;
};

export const getJobRecord = async (id: string) => {
  return await sql`SELECT * FROM jobs WHERE id = ${id}`;
};
