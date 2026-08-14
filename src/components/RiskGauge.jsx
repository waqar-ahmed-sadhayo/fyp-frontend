// A vitals-monitor style arc gauge: the report's signature element.
// `value` is 0-1 probability of the predicted class; `risk` true if the
// predicted label represents disease presence (drives color). `borderline`
// overrides both to an amber "inconclusive" state for a near-coin-flip score.
export default function RiskGauge({ value = 0, risk = false, borderline = false, size = 168 }) {
  const pct = Math.max(0, Math.min(1, value ?? 0));
  const stroke = 8;
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;

  const sweep = 270; // 270-degree gauge like a dial
  const rot = -225; // rotate so gauge opens at bottom

  const toXY = (angleDeg) => {
    const a = (angleDeg * Math.PI) / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  };

  const describeArc = (fraction) => {
    const endAngle = rot + sweep * fraction;
    const [x1, y1] = toXY(rot);
    const [x2, y2] = toXY(endAngle);
    const largeArc = sweep * fraction > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
  };

  const trackPath = describeArc(1);
  const valuePath = describeArc(pct);
  const color = borderline ? "var(--risk-mid)" : risk ? "var(--risk-high)" : "var(--risk-low)";

  return (
    <div className="gauge-wrap">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <path d={trackPath} fill="none" stroke="var(--line)" strokeWidth={stroke} strokeLinecap="round" />
        <path d={valuePath} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
      </svg>
      <div className="gauge-value" style={{ color, marginTop: -64 * (size / 168) }}>
        {(pct * 100).toFixed(1)}%
      </div>
    </div>
  );
}
