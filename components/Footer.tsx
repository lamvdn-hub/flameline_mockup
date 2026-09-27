const LEGAL_LINKS = [
  "Privacy Policy",
  "Terms of Service",
  "Cookie Policy",
  "Age Verification (18+)",
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <span className="footer__brand">Flameline</span>
        <span className="footer__meta mono">Borås · Sjuhärad · Sverige · trade@flameline.se</span>
        <span className="footer__meta mono">
          18+ · Tobacco products · <span className="footer__warn">Smoking harms your health</span>
        </span>
      </div>
      <div className="container footer__legal">
        {LEGAL_LINKS.map((label) => (
          <button key={label} type="button" className="footer__legal-link">
            {label}
          </button>
        ))}
      </div>
    </footer>
  );
}
