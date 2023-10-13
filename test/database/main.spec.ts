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
      const ids = <any[]>await saveJobInfo([jobInfo], formatters, jobBoard);
      console.log("ids:", ids);

      expect(ids.length).toBe(1);
      const record = await getJobRecord(ids[0]);
      console.log(record);
      expect(1).toBe(2);
    });
  });
});
