"use client";
import { useEffect, useRef } from "react";

const LINKS = [
  { href: "#hero", label: "Home" },
  { href: "#events", label: "Events" },
  { href: "#experience", label: "The Experience" },
  { href: "#brands", label: "Brands" },
];

/**
 * Fixed nav. Translucent over the film; solid ground once the hero has left
 * the viewport so body headings never pass under the wordmark.
 */
export default function Nav() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const hero = document.getElementById("hero");
    const nav = ref.current;
    if (!hero || !nav || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => nav.classList.toggle("nav--solid", !e.isIntersecting), { threshold: 0 });
    io.observe(hero);
    return () => io.disconnect();
  }, []);
  return (
    <header className="nav" ref={ref}>
      <div className="nav__inner">
        <a href="#hero" className="nav__brand">Flameline</a>
        <nav className="nav__links" aria-label="Primary">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="nav__link">{l.label}</a>
          ))}
          <a href="#b2b" className="nav__b2b">B2B Login</a>
        </nav>
      </div>
    </header>
  );
}
