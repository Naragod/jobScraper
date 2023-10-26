import axios from "axios";
import dotenv from "dotenv";
import { Agent } from "https";
import { IProxyCallOptions } from "../scrapers/common/interfaces";

dotenv.config({ path: `.env.${process.env.ENVIRONMENT}` });
const APIOPTIONS = {
  host: process.env.PROXY_DATACENTER_HOST,
  port: process.env.PROXY_DATACENTER_PORT,
  datacenter_username: process.env.PROXY_DATACENTER_USERNAME,
  datacenter_password: process.env.PROXY_DATACENTER_PASSWORD,
  unblocker_username: process.env.PROXY_UNBLOCKER_USERNAME,
  unblocker_password: process.env.PROXY_UNBLOCKER_PASSWORD,
};

const httpsProxyGetCall = async (url: string, proxy: any) => {
  const { data } = await axios.get(url, { proxy, httpsAgent: new Agent({ rejectUnauthorized: false }) });
  return data;
};

// unique sessionIds will be assigned unique IP addresses
// https://help.brightdata.com/hc/en-us/articles/13719730577937#heading-6
export const callProxy = async (
  url: string,
  options: IProxyCallOptions = { useProxy: true, proxyCallType: "datacenter" },
) => {
  const { proxyCallType } = options;
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  if (proxyCallType == "datacenter") {
    const { sessionId = "" } = options;
    const { host, port, datacenter_username: usernameWithoutSessionId, datacenter_password: password } = APIOPTIONS;
    const usernameWithSessionId = `${usernameWithoutSessionId}-session-${sessionId}`;
    const username = sessionId.length > 0 ? usernameWithSessionId : usernameWithoutSessionId;
    const proxy: any = { host, port, auth: { username, password } };
    return await httpsProxyGetCall(url, proxy).catch((err) => {
      console.error("httpsProxyGetCall Failed -- datacenter:", url, err.message);
      return <any>"";
    });
  }
  const { host, port, unblocker_username: username, unblocker_password: password } = APIOPTIONS;
  const proxy: any = { host, port, auth: { username, password } };
  return await httpsProxyGetCall(url, proxy).catch((err) => {
    console.error("httpsProxyGetCall Failed -- unblocker:", url, err.message);
    return <any>"";
  });
};

export const superFetch = async (url: string, options: IProxyCallOptions) => {
  const { useProxy = false } = options;

  if (useProxy) return await callProxy(url, options);
  const response = await fetch(url, { signal: AbortSignal.timeout(3000) });
  return await response.text();
};
