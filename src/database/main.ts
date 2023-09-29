import { IJobInfo } from "../scrapers/common/interfaces";
import { destructureObj } from "../utils/main";
import { sql } from "./db";
import hash from "object-hash";

const formatToDBTableStructure = (job: IJobInfo) => {
  const columns = ["id", "link", "title", "location", "company", "pay", "description", "commitment"];
  const { result, leftOvers } = destructureObj(job, columns);
  return { id: hash(result), ...result, extra: JSON.stringify(leftOvers) };
};

export const saveJobInfo = async (jobInfo: IJobInfo[]) => {
  const jobs = jobInfo.map(formatToDBTableStructure);
  await Promise.allSettled(
    jobs.map(async (job) => {
      await sql`INSERT INTO job_information ${sql(job)}`.catch(console.error);
    })
  );
};
