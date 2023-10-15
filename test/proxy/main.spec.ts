import { callProxy } from "../../src/proxy/main";

describe("Proxy", () => {
  xit("Usage", async () => {
    const result = await callProxy("https://lumtest.com/myip.json");
    console.log(result);
    expect(1).toBe(2);
  });

  it("Same IP on every call", async () => {
    const sessionId = "abcd";

    for (let i = 0; i < 3; i++) {
      const result = await callProxy("https://lumtest.com/myip.json", sessionId);
      console.log(result)
    }
    expect(1).toBe(2);

  });
});
