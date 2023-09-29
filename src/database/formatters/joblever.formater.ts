import hash from "object-hash";
import { destructureObj } from "../../utils/main";
import { IJobInfo } from "../../scrapers/common/interfaces";

const getUniqueId = (job: IJobInfo) => {
  const columns = ["id", "link", "title", "location", "company", "pay", "description", "commitment"];
  const { result } = destructureObj(job, columns);
  return hash(result);
};

export const formatToJobInfoTableStructure = (job: IJobInfo) => {
  const columns = ["id", "link", "title", "location", "company", "pay", "description", "commitment"];
  const { result, leftOvers } = destructureObj(job, columns);
  return { id: hash(result), ...result, extra: JSON.stringify(leftOvers) };
};

// JobLever post return a list of tasks for jobRequirements
export const formatToJobRequirementsStructure = (job: IJobInfo) => {
  return { id: getUniqueId(job), tasks: job.jobRequirements };
};
