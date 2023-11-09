import { redisCon } from "../../src/storage/redis/main";

describe("Redis", () => {
  describe("Usage", () => {
    it("usage", async () => {
      const redcon = await redisCon();
      await redcon.set("key", "value");
      const value = await redcon.get("key");
      expect(value).toEqual("value");
    });
  });
});
