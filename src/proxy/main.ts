import axios from "axios";
import dotenv from "dotenv";
import { Agent } from "https";

dotenv.config({ path: `.env.${process.env.ENVIRONMENT}` });
const APIOPTIONS = {
  host: process.env.PROXY_DATACENTER_HOST,
  port: process.env.PROXY_DATACENTER_PORT,
  username: process.env.PROXY_DATACENTER_USERNAME,
  password: process.env.PROXY_DATACENTER_PASSWORD,
};

// unique sessionIds will be assigned unique IP addresses
// https://help.brightdata.com/hc/en-us/articles/13719730577937#heading-6
export const callProxy = async (url: string, sessionId = "") => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  const { host, port, username: usernameWithoutSessionId, password } = APIOPTIONS;
  const usernameWithSessionId = `${usernameWithoutSessionId}-session-${sessionId}`;
  const username = sessionId.length > 0 ? usernameWithSessionId : usernameWithoutSessionId;
  const proxy: any = { host, port, auth: { username, password } };
  const { data } = await axios
    .get(url, { proxy, httpsAgent: new Agent({ rejectUnauthorized: false }) })
    .catch((err) => {
      console.error("Could not get proxy call:", url, err.message);
      return <any>"";
    });
  return data;
};

export const superFetch = async (url: string, useProxy = false) => {
  if (useProxy) return await callProxy(url);
  const response = await fetch(url, { signal: AbortSignal.timeout(3000) });
  return await response.text();
};
