import * as browserSupport from "../../../src/scrapers/common/playwrightBrowserSupport";
import { handleJobApplicationsInParallel } from "../../../src/scrapers/common/executionSupport";

describe("Execution Support", () => {
  describe("handlerJobApplicationsInParallel", () => {
    const options: any = { concurrent: 1 };

    it("usage", async () => {
      jest.spyOn(browserSupport, "getBrowserPage").mockImplementation(() => Promise.resolve(<any>{ close: () => {} }));
      const mockGetJobInformation = jest.fn().mockImplementation((link: string) => {
        return { link, applicationInfo: {}, jobRequirements: {}, err: false };
      });

      const links = ["a", "b"];
      const expectedResult = [
        { link: "a", applicationInfo: {}, jobRequirements: {}, err: false },
        { link: "b", applicationInfo: {}, jobRequirements: {}, err: false },
      ];

      const { result, jobsToRetry } = await handleJobApplicationsInParallel(links, mockGetJobInformation, options);
      expect(result).toEqual(expectedResult);
      expect(jobsToRetry).toEqual([]);
    });

    it("usage - Jobs to retry exist", async () => {
      jest.spyOn(browserSupport, "getBrowserPage").mockImplementation(() => Promise.resolve(<any>{ close: () => {} }));
      const mockGetJobInformation = jest
        .fn()
        .mockImplementationOnce((link: string) => {
          return { link, applicationInfo: {}, jobRequirements: {}, err: false };
        })
        .mockImplementationOnce((link: string) => {
          return { link, applicationInfo: {}, jobRequirements: {}, err: "some error" };
        });

      const links = ["a", "b"];
      const expectedResult = [{ link: "a", applicationInfo: {}, jobRequirements: {}, err: false }];
      const expectedJobsToRetry = [{ link: "b", applicationInfo: {}, jobRequirements: {}, err: "some error" }];

      const { result, jobsToRetry } = await handleJobApplicationsInParallel(links, mockGetJobInformation, options);
      expect(result).toEqual(expectedResult);
      expect(jobsToRetry).toEqual(expectedJobsToRetry);
    });
  });
});
