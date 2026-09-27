import { test, expect } from "vitest";
import { encodeArgs, posterArgs, uploadScaleArgs, vp9ShimArgs } from "../scripts/lib/ffmpeg.mjs";

test("encodeArgs matches the spec", () => {
  expect(encodeArgs("a.mp4", "b.mp4").join(" ")).toBe(
    "-y -i a.mp4 -an -vf unsharp=5:5:0.8:5:5:0.0 -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p -g 8 -keyint_min 8 -sc_threshold 0 -movflags +faststart b.mp4",
  );
});

test("posterArgs", () => {
  expect(posterArgs("a.png", "a.webp").join(" ")).toBe("-y -i a.png -vf scale=1800:-2 -c:v libwebp -quality 84 a.webp");
});

test("uploadScaleArgs caps width at 1920 and keeps aspect", () => {
  expect(uploadScaleArgs("a.png", "b.png").join(" ")).toBe("-y -i a.png -vf scale='min(1920,iw)':-2 b.png");
});

test("vp9ShimArgs keeps the scrub GOP and drops audio (QA-only transcode for codec-less Chromium)", () => {
  expect(vp9ShimArgs("a.mp4", "b.mp4").join(" ")).toBe("-y -i a.mp4 -an -c:v libvpx-vp9 -deadline realtime -cpu-used 8 -crf 30 -b:v 0 -g 8 -keyint_min 8 -pix_fmt yuv420p b.mp4");
});
