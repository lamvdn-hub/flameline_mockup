import ImageSlot from "./ImageSlot";
import SectionHead from "./SectionHead";

/** Placeholder-grade: three slots for the client's event photography, one wide. */
const SHOTS = [
  { label: "Event photo · Tasting evening", ratio: "4 / 3", className: "gallery__wide" },
  { label: "Event photo · Corporate host", ratio: "3 / 4", className: "" },
  { label: "Event photo · The room", ratio: "3 / 4", className: "" },
];

export default function EventGallery() {
  return (
    <section id="evenings" className="section gallery-section">
      <div className="container">
        <SectionHead num="02" title={<>Cigar evenings, <em>hosted</em></>} aside="Photography to follow" />
        <p className="section-lead">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua, quis nostrud exercitation ullamco laboris.
        </p>
        <div className="gallery">
          {SHOTS.map((s) => (
            <ImageSlot key={s.label} label={s.label} ratio={s.ratio} className={s.className} />
          ))}
        </div>
      </div>
    </section>
  );
}
