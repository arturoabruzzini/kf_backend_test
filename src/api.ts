import fetch from "node-fetch";
import { paths } from "./types";

const basePath = "https://api.krakenflex.systems/interview-tests-mock-api/v1";
const headers: RequestInit["headers"] = {
  "x-api-key": "EltgJ5G8m44IzwE6UN2Y4B4NjPW77Zk6FJK3lL23",
};

export const getOutages = async (): Promise<
  paths["/outages"]["get"]["responses"][200]["content"]["application/json"]
> => {
  const response = await fetch(`${basePath}/outages`, {
    method: "GET",
    headers,
  });

  const body = await response.json();
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${body.message}`);
  }

  return body;
};

export const getSiteInfo = async (
  site: string
): Promise<
  paths["/site-info/{siteId}"]["get"]["responses"][200]["content"]["application/json"]
> => {
  const response = await fetch(`${basePath}/site-info/${site}`, {
    method: "GET",
    headers,
  });

  const body = await response.json();
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${body.message}`);
  }

  return body;
};

export const postSiteOutages = async (
  site: string,
  request: paths["/site-outages/{siteId}"]["post"]["requestBody"]["content"]["application/json"]
): Promise<void> => {
  const response = await fetch(`${basePath}/site-outages/${site}`, {
    method: "POST",
    body: JSON.stringify(request),
    headers,
  });

  const body = await response.json();
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${body.message}`);
  }
};
