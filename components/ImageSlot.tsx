type Props = { label: string; ratio?: string; className?: string };

/** Labelled placeholder for a client-supplied photograph. */
export default function ImageSlot({ label, ratio = "16 / 9", className = "" }: Props) {
  return (
    <div className={`image-slot ${className}`} style={{ aspectRatio: ratio }} role="img" aria-label={`${label} placeholder`}>
      <span className="mono">{label}</span>
    </div>
  );
}
