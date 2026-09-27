import { test, expect } from "vitest";
import { encodeArgs, posterArgs } from "../scripts/lib/ffmpeg.mjs";

test("encodeArgs matches the spec", () => {
  expect(encodeArgs("a.mp4", "b.mp4").join(" ")).toBe(
    "-y -i a.mp4 -an -vf unsharp=5:5:0.8:5:5:0.0 -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p -g 8 -keyint_min 8 -sc_threshold 0 -movflags +faststart b.mp4",
  );
});

test("posterArgs", () => {
  expect(posterArgs("a.png", "a.webp").join(" ")).toBe("-y -i a.png -vf scale=1800:-2 -c:v libwebp -quality 84 a.webp");
});
