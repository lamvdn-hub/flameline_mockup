import SectionHead from "./SectionHead";

const PATHS = [
  {
    href: "#events",
    kicker: "Event services",
    title: "Corporate & private tastings",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    cta: "View packages →",
  },
  {
    href: "#experience",
    kicker: "Culture & education",
    title: "The cigar experience",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
    cta: "Start reading →",
  },
  {
    href: "#brands",
    kicker: "The portfolio",
    title: "Horacio & Barreda",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit.",
    cta: "Meet the brands →",
  },
];

export default function Pathways() {
  return (
    <section id="experience" className="section pathways">
      <div className="container">
        <SectionHead num="01" title={<>Three ways <em>in</em></>} />
        <div className="pathways__grid">
          {PATHS.map((p) => (
            <a key={p.href} href={p.href} className="pathway">
              <span className="pathway__kicker mono">{p.kicker}</span>
              <span className="pathway__title display">{p.title}</span>
              <p className="pathway__body">{p.body}</p>
              <span className="pathway__cta mono">{p.cta}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
