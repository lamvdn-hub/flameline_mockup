type Props = { num: string; title: React.ReactNode; aside?: string };

export default function SectionHead({ num, title, aside }: Props) {
  return (
    <div className="section-head">
      <span className="section-head__num">{num}</span>
      <h2 className="section-head__title display">{title}</h2>
      <span className="rule" />
      {aside ? <span className="section-head__aside mono">{aside}</span> : null}
    </div>
  );
}
