import { test, expect } from "vitest";
import { SCENES, SCENE_IDS } from "@/lib/scroll-world/scenes";
import { buildConfig, titleToHtml, placeholderStill } from "@/lib/scroll-world/config";

test("four scenes in order with spec copy", () => {
  expect(SCENE_IDS).toEqual(["field", "gallery", "humidor", "light"]);
  expect(SCENES[0].title).toBe("The line from leaf to light.");
  expect(SCENES[0].titleEm).toBe("leaf");
  expect(SCENES[3].cta?.primary).toEqual({ label: "Explore the cigar experience", href: "#experience" });
  expect(SCENES[3].cta?.secondary).toEqual({ label: "B2B partner login", href: "#b2b" });
});

test("titleToHtml escapes and wraps the em", () => {
  expect(titleToHtml("The line from leaf to light.", "leaf")).toBe("The line from <em>leaf</em> to light.");
  expect(titleToHtml("a < b")).toBe("a &lt; b");
});

test("buildConfig omits clip when missing and falls back to placeholder still", () => {
  const cfg = buildConfig(SCENES, {
    stills: { field: "/assets/stills/field.webp" },
    clips: { field: "/assets/vid/field.mp4" },
  });
  expect(cfg.connectors).toEqual([]);
  expect(cfg.diveScroll).toBe(1.4);
  expect(cfg.crossfade).toBe(0.4);
  expect(cfg.nav).toBe(false);
  expect(cfg.atmosphere).toBe(false);
  expect(cfg.hint).toBe("scroll");
  expect(cfg.sections[0]).toMatchObject({
    id: "field",
    still: "/assets/stills/field.webp",
    clip: "/assets/vid/field.mp4",
    scroll: 1.7,
    linger: 0.35,
    titleHtml: "The line from <em>leaf</em> to light.",
  });
  expect(cfg.sections[1].clip).toBeUndefined();
  expect(cfg.sections[1].still).toBe(placeholderStill("gallery"));
  expect(cfg.sections[1].linger).toBe(0.25);
  expect(cfg.sections[3]).toMatchObject({ scroll: 1.8, linger: 0.45 });
  expect(cfg.sections.every((s) => s.accent === "#d49152")).toBe(true);
});

test("every scene body is lorem ipsum (demo copy only)", () => {
  for (const s of SCENES) expect(s.body).toMatch(/^Lorem ipsum/);
});
