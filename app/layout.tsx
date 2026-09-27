import type { Metadata } from "next";
import { Cormorant_Garamond, Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});
const body = Inter_Tight({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Flameline · Premium Cigar Distribution",
  description:
    "Flameline curates and distributes premium, handcrafted cigars for the Nordics. Scroll to follow the line from leaf to light.",
};

const CONTRACT = `<!--
THESIS: One continuous camera flight from an Estelí field to a lit cigar replaces the category default of a hero grid, an at-a-glance card and three feature tiles; scroll drives time, nothing else moves.
OWN-WORLD: Near-black ground (#0c0a08), a single ember key light (#d49152) with amber highlights, Cormorant Garamond display at weight 300 with italic ember emphasis, JetBrains Mono tracked labels, Inter Tight body, 1px hairlines, square corners, fine film grain over everything.
STORY: A distributor understands within one viewport that one house holds the whole line, distribution, hosted evenings and education, and enters the partner portal.
FIRST VIEWPORT: Full-bleed field still under a vignette; nav fixed top; copy pinned left at 42vw, kicker, headline, one sentence, two tags; route rail of four ember dots right; scroll hint bottom centre.
FORM: Photoreal continuous walkthrough, scroll-world architecture A, four legs, no connectors. Position 1 of the ordered list, chosen by the user; code-led, no seed key.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
-->`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <div hidden dangerouslySetInnerHTML={{ __html: CONTRACT }} />
        {children}
      </body>
    </html>
  );
}
