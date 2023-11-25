import hash from "object-hash";
import { destructureObj } from "../../../utils/main";
import { IFormatter, IJobInfo } from "../../../scrapers/interfaces";

const getUniqueId = (job: IJobInfo) => {
  const columns = ["id", "link", "title", "location", "company", "commitment", "pay", "description"];
  const { result } = destructureObj(job, columns);
  return hash(result);
};

export const formatToJobInfoTableStructure = (job: IJobInfo) => {
  const columns = ["id", "link", "title", "location", "company", "commitment", "pay", "description"];
  const { result, leftOvers } = destructureObj(job, columns);
  return { id: hash(result), ...result, extra: JSON.stringify(leftOvers) };
};

// JobLever post return a list of tasks for jobRequirements
export const formatToJobRequirementsStructure = (job: IJobInfo) => {
  return { id: getUniqueId(job), tasks: job.jobRequirements.tasks };
};

export const formatters: IFormatter = { formatToJobInfoTableStructure, formatToJobRequirementsStructure };
