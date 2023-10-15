import { timeElapsed } from "../../utils/main";
import {
  searchJobs as searchJobsOnLinkedIn,
  parseJobs as parseJobsOnLinkedIn,
  scrapeJobsNatively as scrapeJobsNativelyOnLinkedIn,
} from "../../scrapers/linkedIn/main";
import {
  searchJobs as searchJobsOnCanadaJobBoad,
  parseJobs as parseJobsOnCanadaJobBoard,
  scrapeJobsNatively as scrapeJobsNativelyOnCananaJobBoard,
} from "../../scrapers/canadaJobBank/main";

export const searchJobs = async (searchTerm: string, location: string, age: number, searchSize = 100) => {
  // canadaJobBoard
  // **************************************************************************
  await timeElapsed(searchJobsOnCanadaJobBoad, { searchTerm, location, age }, searchSize); // uses queues

  // linkedIn
  // **************************************************************************
  await timeElapsed(searchJobsOnLinkedIn, { searchTerm, location, age }, searchSize); // uses queues
};

export const parseJobs = async () => {
  // canadaJobBoard
  // **************************************************************************
  await parseJobsOnCanadaJobBoard();

  // linkedIn
  // **************************************************************************
  await parseJobsOnLinkedIn();
};

export const scrapeNatively = async (searchTerm: string, location: string, age: number, searchSize = 100) => {
  // canadaJobBoard
  // **************************************************************************
  await timeElapsed(scrapeJobsNativelyOnCananaJobBoard, { searchTerm, location, age }, searchSize); // synchronous implementation

  // linkedIn
  // **************************************************************************
  await timeElapsed(scrapeJobsNativelyOnLinkedIn, { searchTerm, location, age }, searchSize); // synchronous implementation
};
