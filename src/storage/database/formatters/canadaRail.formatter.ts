import hash from "object-hash";
import { destructureObj } from "../../../utils/main";
import { IFormatter, IJobInfo } from "../../../scrapers/interfaces";

const getUniqueId = (job: IJobInfo) => {
  const columns = ["id", "title", "link", "company", "location"];
  const { result } = destructureObj(job, columns);
  return hash(result);
};

export const formatToJobInfoTableStructure = (job: IJobInfo) => {
  const columns = ["id", "title", "link", "company", "location"];
  const { result, leftOvers } = destructureObj(job, columns);
  const { externalLink = "", ...data } = result;
  return { id: hash(data), external_link: externalLink, ...data, extra: JSON.stringify(leftOvers) };
};

// JobLever post return a list of tasks for jobRequirements
export const formatToJobRequirementsStructure = (job: IJobInfo) => {
  return { id: getUniqueId(job), tasks: job.jobRequirements.tasks };
};

export const formatters: IFormatter = { formatToJobInfoTableStructure, formatToJobRequirementsStructure };
