import hash from "object-hash";
import { destructureObj } from "../../utils/main";
import { IJobInfo } from "../../scrapers/common/interfaces";

const getUniqueId = (job: IJobInfo) => {
  const columns = ["id", "title", "link", "company", "location", "pay", "commitment", "externalLink"];
  const { result } = destructureObj(job, columns);
  return hash(result);
};

export const formatToJobInfoTableStructure = (job: IJobInfo) => {
  const columns = ["id", "title", "link", "company", "location", "pay", "commitment", "externalLink"];
  const { result, leftOvers } = destructureObj(job, columns);
  const { externalLink = "", ...data } = result;
  return { id: hash(data), external_link: externalLink, ...data, extra: JSON.stringify(leftOvers) };
};

// JobLever post return a list of tasks for jobRequirements
export const formatToJobRequirementsStructure = (job: IJobInfo) => {
  const { education, languages, experience, tasks = [], techExperience } = job.jobRequirements;
  let result: any = { id: getUniqueId(job), tasks };

  if (education !== undefined) result["education"] = education;
  if (experience !== undefined) result["experience"] = experience;
  if (languages !== undefined) result["languages"] = [].concat(languages);
  if (techExperience !== undefined) result["tech_experience"] = techExperience;

  return result;
};
