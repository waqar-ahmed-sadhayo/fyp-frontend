import { HomeIcon, ClipboardIcon, DiseaseIcon, PulseIcon } from "./Icons";

// Illustrative mockup for the landing page hero only — sample values, not a
// real user's data or an actual screenshot of the app.
const RISK_CARDS = [
  { key: "heart", label: "Heart", risk: "low" },
  { key: "diabetes", label: "Diabetes", risk: "medium" },
  { key: "breast_cancer", label: "Breast", risk: "low" },
  { key: "kidney", label: "Kidney", risk: "high" },
];

const REPORTS = [
  { label: "Kidney screening", risk: "high" },
  { label: "Heart screening", risk: "low" },
  { label: "Diabetes screening", risk: "medium" },
];

function RadialScore({ pct = 0.72, size = 56 }) {
  const stroke = 5;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke="var(--line)" strokeWidth={stroke}
      />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke="var(--brand)" strokeWidth={stroke}
        strokeDasharray={c} strokeDashoffset={c * (1 - pct)}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x="50%" y="52%" textAnchor="middle" dominantBaseline="middle"
        fontSize="13" fontWeight="700" fill="var(--ink)"
      >
        {Math.round(pct * 100)}
      </text>
    </svg>
  );
}

export default function DashboardPreview() {
  return (
    <div className="laptop-mockup" aria-hidden="true">
      <div className="laptop-screen">
        <div className="laptop-camera" />
        <div className="laptop-viewport">
          <div className="mock-sidebar">
            <span className="active"><HomeIcon /></span>
            <span><PulseIcon /></span>
            <span><ClipboardIcon /></span>
          </div>
          <div className="mock-main">
            <div className="mock-header">
              <div>
                <div className="mock-header-title">Screening overview</div>
                <div className="mock-header-sub">5 conditions tracked</div>
              </div>
              <span className="mock-avatar" />
            </div>
            <div className="mock-body">
              <div className="mock-risk-grid">
                {RISK_CARDS.map((c) => (
                  <div className="mock-risk-card" key={c.key}>
                    <DiseaseIcon disease={c.key} width={10} height={10} style={{ color: "var(--brand)" }} />
                    <div className="name">{c.label}</div>
                    <span className={`mock-risk-badge ${c.risk}`}>{c.risk}</span>
                  </div>
                ))}
              </div>
              <div className="mock-side-panel">
                <div className="mock-radial-card">
                  <RadialScore pct={0.72} />
                  <div className="mock-radial-label">Health score</div>
                </div>
                <div className="mock-reports">
                  <div className="mock-reports-title">Recent reports</div>
                  {REPORTS.map((r) => (
                    <div className="mock-report-row" key={r.label}>
                      <span className="dot" style={{ background: `var(--risk-${r.risk === "medium" ? "mid" : r.risk})` }} />
                      <span className="label">{r.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="laptop-base" />
      <p className="mock-caption">Illustrative preview — not real patient data</p>
    </div>
  );
}
