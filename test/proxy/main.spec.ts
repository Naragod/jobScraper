import { callProxy } from "../../src/proxy/main";

describe("Proxy", () => {
  describe("datacenter", () => {
    const proxyCallType = "datacenter";

    it("Usage", async () => {
      let ips = [];

      for (let i = 0; i < 2; i++) {
        const { ip } = await callProxy("https://lumtest.com/myip.json", { proxyCallType });
        ips.push(ip);
      }
      const uniqueIps = [...new Set(ips)];
      expect(2).toEqual(uniqueIps.length);
    });

    it("Same IP on every call", async () => {
      let ips = [];
      const sessionId = "abcd";

      for (let i = 0; i < 2; i++) {
        const { ip } = await callProxy("https://lumtest.com/myip.json", { sessionId, proxyCallType });
        ips.push(ip);
      }
      const uniqueIps = [...new Set(ips)];
      expect(1).toEqual(uniqueIps.length);
    });
  });
  describe("unblocker", () => {
    const proxyCallType = "unblocker";

    it("Usage", async () => {
      let ips = [];

      for (let i = 0; i < 2; i++) {
        const { ip } = await callProxy("https://lumtest.com/myip.json", { proxyCallType });
        ips.push(ip);
      }
      const uniqueIps = [...new Set(ips)];
      expect(2).toEqual(uniqueIps.length);
    });

    // It says it is possible here: https://help.brightdata.com/hc/en-us/articles/4413222096017-How-do-I-keep-the-same-IP-over-different-requests-
    // This does not seem to be the case
    it("Same IP on every call", async () => {
      let ips = [];
      const sessionId = "abcd";

      for (let i = 0; i < 2; i++) {
        const { ip } = await callProxy("https://lumtest.com/myip.json", { sessionId, proxyCallType });
        ips.push(ip);
      }
      const uniqueIps = [...new Set(ips)];
      console.log("same Ip: uniqueIps:", uniqueIps);
      expect(1).toEqual(uniqueIps.length);
    });
  });
});
