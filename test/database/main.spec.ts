import { cleanDatabase } from "../../src/database/db";
import {
  formatToJobInfoTableStructure,
  formatToJobRequirementsStructure,
} from "../../src/database/formatters/linkedIn.formatter";
import { saveJobInfo, getJobRecord } from "../../src/database/main";
import { linkedInDummyJob } from "./data/dummyJob.json";

describe("Database", () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  describe("saveJobInfo", () => {
    it("usage - save simple job", async () => {
      const { jobInfo, jobBoard } = linkedInDummyJob;
      const formatters = { formatToJobInfoTableStructure, formatToJobRequirementsStructure };
      const ids = <any[]>await saveJobInfo(jobInfo, formatters, jobBoard);

      expect(ids.length).toBe(1);
      const record = await getJobRecord(ids[0]);
      const { id, ...result } = record[0];
      expect(result).toEqual({
        job_board: "linkedIn",
        job_information_id: "f8efb9d087ac6faf9db724943cd62eb31e6823f7",
        job_requirements_id: "f8efb9d087ac6faf9db724943cd62eb31e6823f7",
      });
    });
  });
});
