import { readFileSync } from "node:fs";
import { test, expect } from "vitest";

test("CTA anchors resolve to sections in the export", () => {
  const html = readFileSync("out/index.html", "utf8");
  for (const id of ["experience", "events", "b2b"]) expect(html).toContain(`id="${id}"`);
  expect(html).toContain("Three ways");
  expect(html).toContain("Smoking harms your health");
});
