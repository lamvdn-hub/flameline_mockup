"use client";

import { useEffect, useRef } from "react";
import { mountScrollWorld } from "@/lib/scroll-world/scrub-engine.js";
import { buildConfig, titleToHtml, type Manifest } from "@/lib/scroll-world/config";
import { SCENES } from "@/lib/scroll-world/scenes";

type Props = { manifest: Manifest };

/**
 * The scroll-scrubbed hero film. Server markup is a plain stacked fallback
 * (stills + copy) so the page reads without JavaScript; on mount the engine
 * replaces it with the fixed stage, pinned copy and route rail.
 */
export default function HeroFilm({ manifest }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const config = buildConfig(SCENES, manifest);

  useEffect(() => {
    if (!ref.current) return;
    return mountScrollWorld(ref.current, config);
    // config is derived from static data + build-time manifest; mount once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={ref} className="hero-film" aria-label="The line from leaf to light">
      {config.sections.map((s, i) => (
        <section key={s.id} className="hero-film__fallback">
          <img src={s.still} alt="" width={1920} height={1080} loading={i === 0 ? "eager" : "lazy"} />
          <div className="hero-film__copy">
            <p className="kicker">{s.eyebrow}</p>
            <h2 className="display" dangerouslySetInnerHTML={{ __html: titleToHtml(SCENES[i].title, SCENES[i].titleEm) }} />
            <p>{s.body}</p>
          </div>
        </section>
      ))}
    </div>
  );
}
