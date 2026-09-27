import ImageSlot from "./ImageSlot";
import SectionHead from "./SectionHead";

/** Placeholder-grade: the client's portrait and a word from the house. No name is invented. */
export default function Founder() {
  return (
    <section id="house" className="section house">
      <div className="container">
        <SectionHead num="04" title={<>A word from <em>the house</em></>} />
        <div className="house__grid">
          <ImageSlot label="Portrait · Founder" ratio="3 / 4" className="house__portrait" />
          <div className="house__text">
            <blockquote className="house__quote display">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
              et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
            </blockquote>
            <p className="house__body">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in
              voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
              proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <p className="house__sign mono">
              <span className="house__sign-name">Founder name</span>
              <span className="house__sign-role">Founder · Flameline AB · Borås</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
