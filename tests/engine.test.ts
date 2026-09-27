// @vitest-environment jsdom
import { test, expect, beforeEach, vi } from "vitest";
import { mountScrollWorld } from "@/lib/scroll-world/scrub-engine.js";
import { buildConfig } from "@/lib/scroll-world/config";
import { SCENES } from "@/lib/scroll-world/scenes";

beforeEach(() => {
  document.body.innerHTML = "";
  document.getElementById("sw-css")?.remove();
  window.matchMedia = ((q: string) => ({
    matches: false,
    media: q,
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() { return false; },
  })) as unknown as typeof window.matchMedia;
  window.requestAnimationFrame = ((cb: FrameRequestCallback) => setTimeout(() => cb(0), 0) as unknown as number) as typeof window.requestAnimationFrame;
  window.cancelAnimationFrame = ((id: number) => clearTimeout(id)) as typeof window.cancelAnimationFrame;
  Object.defineProperty(window, "innerHeight", { value: 1000, configurable: true, writable: true });
  Object.defineProperty(window, "innerWidth", { value: 1440, configurable: true, writable: true });
  Object.defineProperty(window, "scrollY", { value: 0, configurable: true, writable: true });
});

const mount = () => {
  const el = document.createElement("div");
  el.innerHTML = "<p class='ssr'>fallback</p>";
  document.body.appendChild(el);
  const un = mountScrollWorld(el, buildConfig(SCENES, { stills: {}, clips: {} }));
  return { el, un };
};

test("no topbar when brand, nav and cta are absent", () => {
  const { el } = mount();
  expect(el.querySelector(".sw-topbar")).toBeNull();
});

test("server fallback markup is replaced on mount", () => {
  const { el } = mount();
  expect(el.querySelector(".ssr")).toBeNull();
  expect(el.querySelectorAll(".sw-scene").length).toBe(4);
});

test("title renders titleHtml with the em", () => {
  const { el } = mount();
  expect(el.querySelector(".sw-copy__title")!.innerHTML).toBe("The line from <em>leaf</em> to light.");
});

test("sw-ended is set past the film and the finale copy fades", async () => {
  const { el } = mount();
  const total = (1.7 + 1.4 + 1.4 + 1.8) * 1000;
  (window as unknown as { scrollY: number }).scrollY = total + 600;
  window.dispatchEvent(new Event("scroll"));
  await new Promise((r) => setTimeout(r, 20));
  expect(el.classList.contains("sw-ended")).toBe(true);
  const copies = el.querySelectorAll<HTMLElement>(".sw-copy");
  expect(Number(copies[3].style.opacity)).toBe(0);
});

test("finale copy holds at the end of its leg", async () => {
  const { el } = mount();
  const total = (1.7 + 1.4 + 1.4 + 1.8) * 1000;
  (window as unknown as { scrollY: number }).scrollY = total - 10;
  window.dispatchEvent(new Event("scroll"));
  await new Promise((r) => setTimeout(r, 20));
  expect(el.classList.contains("sw-ended")).toBe(false);
  const copies = el.querySelectorAll<HTMLElement>(".sw-copy");
  expect(Number(copies[3].style.opacity)).toBeGreaterThan(0.9);
});

test("unmount removes injected nodes", () => {
  const { el, un } = mount();
  un();
  expect(el.querySelector(".sw-stage")).toBeNull();
});
