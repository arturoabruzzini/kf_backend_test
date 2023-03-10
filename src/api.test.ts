import fetch from "node-fetch";
import { getOutages, getSiteInfo, postSiteOutages } from "./api";
const { Response } = jest.requireActual("node-fetch");

jest.mock("node-fetch", () => jest.fn());

describe("api", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getOutages", () => {
    it("should return the response", async () => {
      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
        new Response(JSON.stringify("response body"))
      );
      expect(await getOutages()).toEqual("response body");
    });
    it("should throw errors", async () => {
      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
        new Response(JSON.stringify({ message: "error message" }), {
          status: "400",
        })
      );
      await expect(getOutages()).rejects.toEqual(
        new Error("Request failed: 400 error message")
      );
    });

    it("should retry 500 errors", async () => {
      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
        new Response(JSON.stringify({ message: "error message" }), {
          status: "500",
        })
      );
      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
        new Response(JSON.stringify("response body"))
      );
      expect(await getOutages()).toEqual("response body");
      expect(fetch as jest.MockedFunction<typeof fetch>).toHaveBeenCalledTimes(
        2
      );
    });

    it("should retry 500 errors up to 3 times", async () => {
      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
        new Response(JSON.stringify({ message: "error message" }), {
          status: "500",
        })
      );
      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
        new Response(JSON.stringify({ message: "error message" }), {
          status: "500",
        })
      );
      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
        new Response(JSON.stringify({ message: "error message" }), {
          status: "500",
        })
      );
      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
        new Response(JSON.stringify({ message: "error message" }), {
          status: "500",
        })
      );

      await expect(getOutages()).rejects.toEqual(
        new Error("Request failed: 500 error message")
      );
      expect(fetch as jest.MockedFunction<typeof fetch>).toHaveBeenCalledTimes(
        4
      );
    });
  });

  describe("getSiteInfo", () => {
    it("should return the response", async () => {
      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
        new Response(JSON.stringify("response body"))
      );
      expect(await getSiteInfo("site")).toEqual("response body");
    });
    it("should throw errors", async () => {
      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
        new Response(JSON.stringify({ message: "error message" }), {
          status: "400",
        })
      );
      await expect(getSiteInfo("site")).rejects.toEqual(
        new Error("Request failed: 400 error message")
      );
    });
  });

  describe("postSiteOutages", () => {
    it("should return the response", async () => {
      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
        new Response(JSON.stringify("response body"))
      );
      expect(await postSiteOutages("site", [])).toReturn;
    });
    it("should throw errors", async () => {
      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
        new Response(JSON.stringify({ message: "error message" }), {
          status: "400",
        })
      );
      await expect(postSiteOutages("site", [])).rejects.toEqual(
        new Error("Request failed: 400 error message")
      );
    });
  });
});
