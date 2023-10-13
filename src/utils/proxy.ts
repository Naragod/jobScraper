import axios from "axios";
import dotenv from "dotenv";

dotenv.config({ path: `.env.${process.env.ENVIRONMENT}` });

const APIOPTIONS = {
  host: process.env.PROXY_DATACENTER_HOST,
  port: process.env.PROXY_DATACENTER_PORT,
  username: process.env.PROXY_DATACENTER_USERNAME,
  password: process.env.PROXY_DATACENTER_PASSWORD,
};

const callProxy = async (url: string, options: any) => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  const { host, port, username, password } = options;
  const proxy = { host, port, auth: { username, password } };
  const { data } = await axios.get(url, proxy).catch((err) => {
    console.error("Could not get proxy call:", url, err.message);
    return <any>"";
  });
  return data;
};

export const superFetch = async (url: string, options: any = APIOPTIONS) => {
  const { useProxy = false } = options;

  if (useProxy) return await callProxy(url, options);
  const response = await fetch(url, { signal: AbortSignal.timeout(3000) });
  return await response.text();
};
