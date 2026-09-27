import ImageSlot from "./ImageSlot";

const PACKAGES = [
  { name: "01 · The Discovery", level: "Beginners" },
  { name: "02 · The Signature", level: "Enthusiasts" },
  { name: "03 · The Reserve", level: "Aficionados" },
];

export default function EventsTeaser() {
  return (
    <section id="events" className="section section--panel events">
      <div className="container events__grid">
        <div>
          <p className="kicker kicker--ember">Event services</p>
          <h2 className="events__title display">
            An evening your guests will <em>talk about</em> for years.
          </h2>
          <p className="events__body">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
            ex ea commodo consequat.
          </p>
          <a href="#events" className="btn btn--outline">See event packages</a>
        </div>
        <div className="events__side">
          <ImageSlot label="Lounge photo" />
          <ul className="packages">
            {PACKAGES.map((p) => (
              <li key={p.name} className="packages__row">
                <span className="packages__name display">{p.name}</span>
                <span className="packages__level mono">{p.level}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
