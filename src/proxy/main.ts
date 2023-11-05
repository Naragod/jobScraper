import axios from "axios";
import dotenv from "dotenv";
import { Agent } from "https";
import { IProxyCallOptions } from "../scrapers/common/interfaces";

dotenv.config({ path: `.env.${process.env.ENVIRONMENT}` });
const APIOPTIONS = {
  host: process.env.PROXY_DATACENTER_HOST || "",
  port: process.env.PROXY_DATACENTER_PORT || "",
};

const SERVICE_INFORMATION: any = {
  datacenter: {
    username: process.env.PROXY_DATACENTER_USERNAME || "",
    password: process.env.PROXY_DATACENTER_PASSWORD || "",
  },
  unblocker: {
    username: process.env.PROXY_UNBLOCKER_USERNAME || "",
    password: process.env.PROXY_UNBLOCKER_PASSWORD || "",
  },
};

const httpsProxyGetCall = async (url: string, config: any) => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  const { host, port, username: usernameWithoutSessionId, sessionId, password, proxyCallType } = config;
  const usernameWithSessionId = `${usernameWithoutSessionId}-session-${sessionId}`;
  const username = sessionId.length > 0 ? usernameWithSessionId : usernameWithoutSessionId;
  const proxy = { host, port, auth: { username, password } };

  const { data } = await axios
    .get(url, { proxy, httpsAgent: new Agent({ rejectUnauthorized: false }) })
    .catch((err) => {
      console.error(`httpsProxyGetCall Failed -- ${proxyCallType}:`, url, err.message);
      throw err;
    });
  return data;
};

// unique sessionIds will be assigned unique IP addresses
// https://help.brightdata.com/hc/en-us/articles/13719730577937#heading-6
export const callProxy = async (url: string, options: IProxyCallOptions = { proxyCallType: "datacenter" }) => {
  const { host, port } = APIOPTIONS;
  const { proxyCallType, sessionId = "" } = options;

  const service = SERVICE_INFORMATION[<string>proxyCallType];
  if (service == undefined) throw new Error(`Unknown proxyCallType: ${proxyCallType}`);

  const password = service["password"];
  const username = service["username"];
  const config = { host, port, username, password, sessionId, proxyCallType };
  return await httpsProxyGetCall(url, config);
};

export const superFetch = async (url: string, options: IProxyCallOptions) => {
  const { useProxy = false } = options;

  if (useProxy) return await callProxy(url, options);
  const response = await fetch(url, { signal: AbortSignal.timeout(3000) });
  return await response.text();
};
