// @vitest-environment jsdom
import { test, expect, beforeEach } from "vitest";
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

test("atmosphere:false renders no particles", () => {
  const { el } = mount();
  expect(el.querySelector(".sw-particles")).toBeNull();
  expect(el.querySelectorAll(".sw-pt").length).toBe(0);
});

test("a clip that 404s is fetched once, not on every scroll", async () => {
  const calls: string[] = [];
  const realFetch = globalThis.fetch;
  globalThis.fetch = ((url: string) => { calls.push(String(url)); return Promise.resolve({ ok: false } as Response); }) as typeof fetch;
  try {
    const el = document.createElement("div");
    document.body.appendChild(el);
    mountScrollWorld(el, buildConfig(SCENES, { stills: {}, clips: { field: "/assets/vid/field.mp4" } }));
    for (let i = 0; i < 30; i++) {
      (window as unknown as { scrollY: number }).scrollY = i * 10;
      window.dispatchEvent(new Event("scroll"));
      await new Promise((r) => setTimeout(r, 5));
    }
    expect(calls.filter((u) => u.endsWith("field.mp4")).length).toBe(1);
  } finally {
    globalThis.fetch = realFetch;
  }
});

test("past the film the last scene holds, the scrim follows the finale copy, and the body cannot reach the copy until it is gone", async () => {
  const { el } = mount();
  const total = (1.7 + 1.4 + 1.4 + 1.8) * 1000;
  expect(el.querySelector<HTMLElement>(".sw-track")!.style.height).toBe(`${total + 1500}px`);
  (window as unknown as { scrollY: number }).scrollY = total + 300;
  window.dispatchEvent(new Event("scroll"));
  await new Promise((r) => setTimeout(r, 20));
  const scenes = el.querySelectorAll<HTMLElement>(".sw-scene");
  expect(Number(scenes[3].style.opacity)).toBe(1);
  const cop = Number(el.querySelectorAll<HTMLElement>(".sw-copy")[3].style.opacity);
  expect(cop).toBeGreaterThan(0);
  expect(cop).toBeLessThan(1);
  expect(Number(el.style.getPropertyValue("--sw-scrim"))).toBeCloseTo(cop, 3);
});
