import { readFileSync } from "node:fs";
import { test, expect } from "vitest";

test("CTA anchors resolve to sections in the export", () => {
  const html = readFileSync("out/index.html", "utf8");
  for (const id of ["experience", "events", "b2b"]) expect(html).toContain(`id="${id}"`);
  expect(html).toContain("Three ways");
  expect(html).toContain("Smoking harms your health");
});

test("demo sections mark every client photograph the brief promises: brand, product, event, portrait", () => {
  const html = readFileSync("out/index.html", "utf8");
  for (const id of ["brands", "evenings", "house"]) expect(html).toContain(`id="${id}"`);
  for (const label of ["Brand photo · Horacio", "Brand photo · Barreda", "Product photo", "Event photo", "Portrait · Founder"]) {
    expect(html).toContain(label);
  }
  expect(html).toContain('href="#brands"');   // nav and pathway card point at the brands section
  expect(html).not.toMatch(/Founder<\/span>\s*<[^>]*>\s*[A-Z][a-z]+ [A-Z][a-z]+/); // no fabricated founder name
});
