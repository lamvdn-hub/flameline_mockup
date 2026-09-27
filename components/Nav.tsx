const LINKS = [
  { href: "#hero", label: "Home" },
  { href: "#events", label: "Events" },
  { href: "#experience", label: "The Experience" },
  { href: "#b2b", label: "Brands" },
];

export default function Nav() {
  return (
    <header className="nav">
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
