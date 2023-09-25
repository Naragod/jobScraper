import { IJobInfo } from "../scrapers/common/interfaces";
import { flatten } from "../utils";

const stripDown = (arr: string[]) => {
  const lowerCaseItems = arr.map((item) => {
    const result = item.toLowerCase().replace(/[\(\)]/, "");
    return flatten(result.split("/"));
  });
  return flatten(lowerCaseItems);
};

export const classify = (job: IJobInfo, candidateSkills: string[]) => {
  const { jobRequirements, link } = job;
  const { techExperience } = jobRequirements;

  if (techExperience == undefined) return { link, skillMatches: [], requirements: [], matchingPercent: 0 };
  const strippedDownSkills = stripDown(candidateSkills);
  const strippedDownTechExp = stripDown(techExperience);
  const skillMatches = strippedDownTechExp.filter((item) => strippedDownSkills.includes(item));
  const matchingPercent = skillMatches.length / strippedDownTechExp.length;
  
  if (isNaN(matchingPercent)) console.log("skillMatches:", skillMatches, "strippedDownTechExp:", strippedDownTechExp, matchingPercent);
  return { link, skillMatches, requirements: strippedDownTechExp, matchingPercent };
};

export const classifyJobs = (jobs: IJobInfo[], skills: string[]) => {
  const matchingSkills = jobs.reduce((arr, job) => {
    // using link as a placeholder for unique identifier
    return arr.concat(<any>classify(job, skills));
  }, []);
  console.log("matchingSkills:", matchingSkills);
};
