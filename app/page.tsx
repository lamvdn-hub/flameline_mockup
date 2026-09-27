import HeroFilm from "@/components/HeroFilm";
import manifest from "@/public/assets/manifest.json";
import type { Manifest } from "@/lib/scroll-world/config";

export default function Page() {
  return (
    <main>
      <div id="hero">
        <HeroFilm manifest={manifest as Manifest} />
      </div>
      {/* Task 5 replaces this spacer with the body sections. */}
      <section id="experience" style={{ minHeight: "100vh", position: "relative", zIndex: 2, background: "var(--ground)" }} />
    </main>
  );
}
