import type { Cta, Scene, SceneId } from "./scenes";

export type Manifest = {
  stills: Partial<Record<SceneId, string>>;
  clips: Partial<Record<SceneId, string>>;
};

export type EngineSection = {
  id: string;
  label: string;
  still: string;
  clip?: string;
  accent: string;
  eyebrow: string;
  titleHtml: string;
  body: string;
  tags: string[];
  scroll?: number;
  linger?: number;
  cta?: Cta;
};

export type EngineConfig = {
  diveScroll: 1.4;
  crossfade: 0.08;
  connectors: [];
  nav: false;
  atmosphere: false;
  hint: "scroll";
  sections: EngineSection[];
};

const ACCENT = "#d49152";

function escapeHtml(s: string): string {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] as string);
}

export function titleToHtml(title: string, em?: string): string {
  const safe = escapeHtml(title);
  if (!em) return safe;
  const safeEm = escapeHtml(em);
  return safe.replace(safeEm, `<em>${safeEm}</em>`);
}

export function placeholderStill(id: SceneId): string {
  return `/assets/stills/placeholder-${id}.svg`;
}

export function buildConfig(scenes: readonly Scene[], manifest: Manifest): EngineConfig {
  return {
    diveScroll: 1.4,
    crossfade: 0.08,
    connectors: [],
    nav: false,
    atmosphere: false,
    hint: "scroll",
    sections: scenes.map((s) => {
      const section: EngineSection = {
        id: s.id,
        label: s.label,
        still: manifest.stills[s.id] ?? placeholderStill(s.id),
        accent: ACCENT,
        eyebrow: s.eyebrow,
        titleHtml: titleToHtml(s.title, s.titleEm),
        body: s.body,
        tags: s.tags,
      };
      const clip = manifest.clips[s.id];
      if (clip) section.clip = clip;
      if (s.scroll !== undefined) section.scroll = s.scroll;
      if (s.linger !== undefined) section.linger = s.linger;
      if (s.cta) section.cta = s.cta;
      return section;
    }),
  };
}
