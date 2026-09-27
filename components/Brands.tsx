import ImageSlot from "./ImageSlot";
import SectionHead from "./SectionHead";

/** Placeholder-grade: the two houses, each with a brand photo and three product slots (line names from the client's catalog). */
const HOUSES = [
  { name: "Horacio", origin: "Estelí, Nicaragua", lines: ["Classic", "Heritage", "Maduro"] },
  { name: "Barreda", origin: "Estelí, Nicaragua", lines: ["Don Chico", "Habano Ecuador", "Maduro"] },
];

export default function Brands() {
  return (
    <section id="brands" className="section section--panel brands">
      <div className="container">
        <SectionHead num="03" title={<>Two houses. <em>One line.</em></>} aside="Horacio · Barreda" />
        <div className="brands__grid">
          {HOUSES.map((h) => (
            <article key={h.name} className="brand">
              <ImageSlot label={`Brand photo · ${h.name}`} ratio="3 / 2" />
              <h3 className="brand__name display">{h.name}</h3>
              <p className="brand__origin mono">{h.origin}</p>
              <p className="brand__body">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <div className="brand__products">
                {h.lines.map((l) => (
                  <div key={l} className="brand__product">
                    <ImageSlot label="Product photo" ratio="1 / 1" />
                    <span className="brand__line mono">{l}</span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
