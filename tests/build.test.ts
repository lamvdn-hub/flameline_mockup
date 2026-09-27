import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { test, expect } from "vitest";

function cssFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? cssFiles(p) : p.endsWith(".css") ? [p] : [];
  });
}

test("static export exists and carries the design contract", () => {
  expect(existsSync("out/index.html")).toBe(true);
  const html = readFileSync("out/index.html", "utf8");
  expect(html).toContain("THESIS:");
  expect(html).toContain("FINISH:");
});

test("exported CSS carries the ember token", () => {
  const files = cssFiles("out/_next/static");
  expect(files.length).toBeGreaterThan(0);
  const css = files.map((f) => readFileSync(f, "utf8")).join("\n");
  expect(css).toContain("--ember:#d49152");
});

test("the document does not use smooth scrolling (it double-eases the scrubbed film)", () => {
  const files = cssFiles("out/_next/static");
  const css = files.map((f) => readFileSync(f, "utf8")).join("\n");
  expect(css.replace(/\s+/g, "")).not.toContain("scroll-behavior:smooth");
});
