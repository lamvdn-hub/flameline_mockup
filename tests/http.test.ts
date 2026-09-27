import { test, expect } from "vitest";
import { decodeDataUri, publicFalUrl } from "../scripts/lib/http.mjs";
import { kieDownloadRequest } from "../scripts/lib/kie.mjs";

test("decodeDataUri returns the bytes and mime of a base64 data URI, null otherwise", () => {
  const d = decodeDataUri("data:image/png;base64,aGVsbG8=");
  expect(d?.mime).toBe("image/png");
  expect(d?.bytes.toString("utf8")).toBe("hello");
  expect(decodeDataUri("https://v3.fal.media/files/x.png")).toBeNull();
});

test("publicFalUrl rewrites the v3b CDN host to the reachable v3 host and leaves others alone", () => {
  expect(publicFalUrl("https://v3b.fal.media/files/b/1/a.png?signature=s")).toBe("https://v3.fal.media/files/b/1/a.png?signature=s");
  expect(publicFalUrl("https://v3.fal.media/files/b/1/a.png")).toBe("https://v3.fal.media/files/b/1/a.png");
});

test("kieDownloadRequest targets the common download-url endpoint with the result url", () => {
  expect(kieDownloadRequest("https://tempfile.aiquickdraw.com/x/y.mp4")).toEqual({
    url: "https://api.kie.ai/api/v1/common/download-url",
    body: { url: "https://tempfile.aiquickdraw.com/x/y.mp4" },
  });
});
