import Nav from "@/components/Nav";
import HeroFilm from "@/components/HeroFilm";
import Pathways from "@/components/Pathways";
import EventsTeaser from "@/components/EventsTeaser";
import EventGallery from "@/components/EventGallery";
import Brands from "@/components/Brands";
import Founder from "@/components/Founder";
import TradeBand from "@/components/TradeBand";
import Footer from "@/components/Footer";
import manifest from "@/public/assets/manifest.json";
import type { Manifest } from "@/lib/scroll-world/config";

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <div id="hero">
          <HeroFilm manifest={manifest as Manifest} />
        </div>
        <div className="body">
          <Pathways />
          <EventsTeaser />
          <EventGallery />
          <Brands />
          <Founder />
          <TradeBand />
        </div>
      </main>
      <Footer />
    </>
  );
}
