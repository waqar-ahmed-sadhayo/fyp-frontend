import { useEffect, useState } from "react";
import { DISEASE_META } from "../diseaseConfig";
import { DiseaseIcon } from "../components/Icons";
import { api } from "../api/client";
import Reveal from "../components/Reveal";

export default function Education() {
  const [info, setInfo] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.diseasesInfo().then(setInfo).catch((e) => setError(e.message));
  }, []);

  return (
    <div className="shell-inner">
      <p className="eyebrow">Learn</p>
      <h2>Understanding the five screenings</h2>
      <p style={{ color: "var(--muted)", marginTop: 4, maxWidth: 68 + "ch" }}>
        General health information to help you read your results in context — not medical advice.
        Always talk to a qualified clinician about symptoms, risk factors or results specific to you.
      </p>

      <div className="disclaimer">
        Educational content only. This page does not diagnose, treat or provide personalized
        medical guidance.
      </div>

      {error && <div className="error-banner">{error}</div>}

      {Object.entries(DISEASE_META).map(([key, meta]) => {
        const d = info?.[key];
        return (
          <Reveal as="section" className="card card-pad" style={{ marginBottom: 18 }} key={key}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <span className="icon-badge" style={{ background: `color-mix(in srgb, ${meta.color} 12%, transparent)`, color: meta.color, marginBottom: 0 }}>
                <DiseaseIcon disease={key} />
              </span>
              <h3 style={{ margin: 0 }}>{meta.label}</h3>
            </div>

            {!d ? (
              <p style={{ fontSize: 13.5, color: "var(--muted)" }}>Loading…</p>
            ) : (
              <>
                <p style={{ fontSize: 14, color: "var(--ink)" }}>{d.overview}</p>
                <div className="form-grid" style={{ marginTop: 16, gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
                  <div>
                    <p className="eyebrow" style={{ marginBottom: 8 }}>Common symptoms</p>
                    <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13.5, color: "var(--muted)" }}>
                      {d.symptoms.map((s) => <li key={s} style={{ marginBottom: 4 }}>{s}</li>)}
                    </ul>
                  </div>
                  <div>
                    <p className="eyebrow" style={{ marginBottom: 8 }}>Risk factors</p>
                    <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13.5, color: "var(--muted)" }}>
                      {d.risk_factors.map((s) => <li key={s} style={{ marginBottom: 4 }}>{s}</li>)}
                    </ul>
                  </div>
                  <div>
                    <p className="eyebrow" style={{ marginBottom: 8 }}>Prevention</p>
                    <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13.5, color: "var(--muted)" }}>
                      {d.prevention.map((s) => <li key={s} style={{ marginBottom: 4 }}>{s}</li>)}
                    </ul>
                  </div>
                </div>
              </>
            )}
          </Reveal>
        );
      })}
    </div>
  );
}
