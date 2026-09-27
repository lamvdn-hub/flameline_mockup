import SectionHead from "./SectionHead";

const PATHS = [
  {
    href: "#events",
    kicker: "Event services",
    title: "Corporate & private tastings",
    body: "Guided cigar evenings for teams and clients: technique, etiquette and a curated flight, hosted by our specialists.",
    cta: "View packages →",
  },
  {
    href: "#experience",
    kicker: "Culture & education",
    title: "The cigar experience",
    body: "Five centuries of history and the anatomy of a handmade cigar. An educational hub for the curious and the devoted.",
    cta: "Start reading →",
  },
  {
    href: "#b2b",
    kicker: "The portfolio",
    title: "Horacio & Barreda",
    body: "Two Nicaraguan-rooted houses we carry: flavor profiles, key lines and what makes each worth shelf space.",
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
