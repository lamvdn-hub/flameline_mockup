import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
export const FFMPEG = process.env.FFMPEG || require("ffmpeg-static");
const run = promisify(execFile);

export async function ffmpeg(args) {
  return run(FFMPEG, ["-v", "error", ...args], { maxBuffer: 1 << 26 });
}

/** The leg's last rendered frame: what the next leg starts from. */
export async function lastFrame(videoPath, pngPath) {
  await ffmpeg(["-y", "-sseof", "-0.15", "-i", videoPath, "-frames:v", "1", "-q:v", "2", pngPath]);
  return pngPath;
}

export async function firstFrame(videoPath, pngPath) {
  await ffmpeg(["-y", "-ss", "0", "-i", videoPath, "-frames:v", "1", "-q:v", "2", pngPath]);
  return pngPath;
}

/**
 * Scrub-friendly encode: native res, crf 20, light sharpen, no audio, faststart.
 * Every scroll frame seeks, so decode cost per seek is what matters: Main profile,
 * no B-frames (no reordering), fastdecode tuning, keyframe every 4 frames so a
 * seek decodes at most 4 simple frames. Pure.
 */
export function encodeArgs(inPath, outPath) {
  return ["-y", "-i", inPath, "-an", "-vf", "unsharp=5:5:0.8:5:5:0.0", "-c:v", "libx264", "-preset", "slow", "-crf", "20", "-pix_fmt", "yuv420p", "-profile:v", "main", "-tune", "fastdecode", "-bf", "0", "-g", "4", "-keyint_min", "4", "-sc_threshold", "0", "-movflags", "+faststart", outPath];
}

/** Poster webp, 1800 px wide, quality 84. Pure. */
export function posterArgs(pngPath, webpPath) {
  return ["-y", "-i", pngPath, "-vf", "scale=1800:-2", "-c:v", "libwebp", "-quality", "84", webpPath];
}

/** Start-image copy for the video model: at most 1920 px wide (Kling's image input is capped at 10 MB). Pure. */
export function uploadScaleArgs(srcPath, dstPath) {
  return ["-y", "-i", srcPath, "-vf", "scale='min(1920,iw)':-2", dstPath];
}

/**
 * QA-only transcode: Playwright's open-source Chromium has no H.264 decoder, so
 * the seam QA re-encodes a scratch copy of the export's clips to VP9 (which it
 * does decode) with the same GOP, and tests the real page against that copy.
 * Shipping assets stay H.264. Pure.
 */
export function vp9ShimArgs(inPath, outPath) {
  return ["-y", "-i", inPath, "-an", "-c:v", "libvpx-vp9", "-deadline", "realtime", "-cpu-used", "8", "-crf", "30", "-b:v", "0", "-g", "8", "-keyint_min", "8", "-pix_fmt", "yuv420p", outPath];
}
