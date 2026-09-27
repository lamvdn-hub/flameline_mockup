export type SceneId = "field" | "gallery" | "humidor" | "light";

export type Cta = {
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
};

export type Scene = {
  id: SceneId;
  label: string;
  eyebrow: string;
  title: string;
  /** substring of `title` rendered in italic ember */
  titleEm?: string;
  body: string;
  tags: string[];
  scroll?: number;
  linger?: number;
  cta?: Cta;
};

export const SCENES: readonly Scene[] = [
  {
    id: "field",
    label: "The leaf",
    eyebrow: "Premium cigar distribution · Borås · Sweden",
    title: "The line from leaf to light.",
    titleEm: "leaf",
    body: "Flameline curates and distributes premium, handcrafted cigars for the Nordics, and shares the culture that surrounds them.",
    tags: ["Horacio · Barreda", "Estelí · Jalapa · Ometepe"],
    scroll: 1.7,
    linger: 0.35,
  },
  {
    id: "gallery",
    label: "The hand",
    eyebrow: "Rolled entubado",
    title: "Made by hand, box after box.",
    body: "Fillers rolled entubado and empalmado: a firm pack with an excellent draw, every time.",
    tags: ["Hand-rolled", "Nicaraguan-rooted"],
    linger: 0.25,
  },
  {
    id: "humidor",
    label: "The house",
    eyebrow: "Yxtobak Lounge · Borås",
    title: "One house holds the whole line.",
    body: "From distributor pricing to guided corporate tastings, beneath a floor-to-ceiling humidor.",
    tags: ["Wholesale", "Events", "Education"],
    linger: 0.25,
  },
  {
    id: "light",
    label: "The light",
    eyebrow: "Trade & enthusiasts · 18+",
    title: "Give it your full attention.",
    body: "A cigar is not smoked against the clock. That is the whole secret.",
    tags: [],
    scroll: 1.8,
    linger: 0.45,
    cta: {
      primary: { label: "Explore the cigar experience", href: "#experience" },
      secondary: { label: "B2B partner login", href: "#b2b" },
    },
  },
];

export const SCENE_IDS: readonly SceneId[] = SCENES.map((s) => s.id);
