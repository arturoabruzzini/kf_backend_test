import fetch from "node-fetch";
import { paths } from "./types";

const basePath = "https://api.krakenflex.systems/interview-tests-mock-api/v1";
const headers: RequestInit["headers"] = {
  "x-api-key": "EltgJ5G8m44IzwE6UN2Y4B4NjPW77Zk6FJK3lL23",
};

class ApiError extends Error {
  public status: number;

  constructor(status: number, message: string) {
    super(`Request failed: ${status} ${message}`);
    this.status = status;
    this.name = "ApiError";
  }
}

const apiWrapper = async (
  path: string,
  options: {
    method: RequestInit["method"];
    body?: string;
  },
  retries = 3,
  backoff = 300
) => {
  const response = await fetch(`${basePath}${path}`, {
    ...options,
    headers,
  });

  const responseBody = await response.json();
  if (!response.ok) {
    // retry 500s
    if (response.status >= 500 && retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, backoff));
      return apiWrapper(path, options, retries - 1, backoff * 2);
    }
    throw new ApiError(response.status, responseBody.message);
  }

  return responseBody;
};

export const getOutages = async (): Promise<
  paths["/outages"]["get"]["responses"][200]["content"]["application/json"]
> => {
  return apiWrapper("/outages", { method: "GET" });
};

export const getSiteInfo = async (
  site: string
): Promise<
  paths["/site-info/{siteId}"]["get"]["responses"][200]["content"]["application/json"]
> => {
  return apiWrapper(`/site-info/${site}`, { method: "GET" });
};

export const postSiteOutages = async (
  site: string,
  request: paths["/site-outages/{siteId}"]["post"]["requestBody"]["content"]["application/json"]
): Promise<void> => {
  await apiWrapper(`/site-outages/${site}`, {
    method: "POST",
    body: JSON.stringify(request),
  });
};
