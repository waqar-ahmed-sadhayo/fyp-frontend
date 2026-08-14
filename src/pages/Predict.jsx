import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";
import { DISEASE_META, getFieldMeta, groupFields } from "../diseaseConfig";
import RiskGauge from "../components/RiskGauge";
import {
  AlertTriangleIcon, CheckCircleIcon, DownloadIcon, FileTextIcon, HelpCircleIcon, UploadIcon,
} from "../components/Icons";

export default function Predict() {
  const { disease } = useParams();
  const meta = DISEASE_META[disease];

  const [features, setFeatures] = useState([]);
  const [form, setForm] = useState({});
  const [metrics, setMetrics] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [exporting, setExporting] = useState(false);
  const csvRef = useRef(null);
  const pdfRef = useRef(null);

  useEffect(() => {
    setResult(null);
    setError("");
    setForm({});
    api.diseases().then((schema) => {
      setFeatures(schema[disease]?.features || []);
      setMetrics(schema[disease]?.metrics || null);
    });
  }, [disease]);

  if (!meta) {
    return (
      <div className="shell-inner">
        <div className="error-banner">Unknown disease "{disease}".</div>
      </div>
    );
  }

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const payload = {};
      for (const f of features) payload[f] = form[f];
      const res = await api.predict(disease, payload);
      setResult(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const uploadCsv = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setBusy(true);
    try {
      const res = await api.predictUpload(disease, file);
      setResult(res);
      setForm(res.input_data);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
      if (csvRef.current) csvRef.current.value = "";
    }
  };

  const uploadPdf = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setBusy(true);
    try {
      const res = await api.predictUploadPdf(disease, file);
      setResult(res);
      setForm(res.input_data);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
      if (pdfRef.current) pdfRef.current.value = "";
    }
  };

  const exportPdf = async () => {
    if (!result) return;
    setError("");
    setExporting(true);
    try {
      await api.exportHistoryPdf(result.id, disease);
    } catch (err) {
      setError(err.message);
    } finally {
      setExporting(false);
    }
  };

  // The backend is the single source of truth for the label — it already
  // accounts for each disease's own tuned decision threshold and flags
  // near-coin-flip scores as "borderline". Never re-derive this from the
  // raw probability here; that's how frontend/backend threshold logic
  // drifts apart.
  const isBorderline = result?.prediction === "borderline";
  const isRisk = result && !isBorderline && !["benign", "negative"].includes(result.prediction);

  return (
    <div className="shell-inner">
      <p className="eyebrow">{meta.label}</p>
      <h2>{meta.tagline}</h2>

      <div className="disclaimer">
        Preliminary screening only. Confirm any elevated result with a licensed
        clinician before acting on it.
      </div>

      <div className="upload-row">
        <span><UploadIcon width={15} height={15} /> Have a lab export? Upload a single-row CSV to auto-fill and predict:</span>
        <input ref={csvRef} type="file" accept=".csv" onChange={uploadCsv} />
      </div>
      <div className="upload-row">
        <span><FileTextIcon width={15} height={15} /> Or upload a lab report PDF (best-effort field extraction):</span>
        <input ref={pdfRef} type="file" accept=".pdf" onChange={uploadPdf} />
      </div>

      {error && <div className="error-banner">{error}</div>}

      {result?.fields_found && (
        <div className="pdf-fields-note">
          <strong>From your PDF:</strong> found {result.fields_found.length
            ? result.fields_found.join(", ") : "no fields"}
          {result.fields_missing?.length > 0 && (
            <> — missing (filled by estimate): {result.fields_missing.join(", ")}</>
          )}
        </div>
      )}

      <div className="predict-layout">
        <form className="card card-pad" onSubmit={submit}>
          <div className="field-groups">
            {groupFields(disease, features).map((group) => (
              <div className="field-group" key={group.title}>
                <p className="field-group-title">{group.title}</p>
                <div className="form-grid">
                  {group.fields.map((f) => {
                    const fm = getFieldMeta(f);
                    return (
                      <div className="field" key={f}>
                        <label>
                          {fm.label}
                          {fm.unit && <span className="hint">{fm.unit}</span>}
                        </label>
                        {fm.type === "select" ? (
                          <select
                            required
                            value={form[f] ?? ""}
                            onChange={(e) => update(f, e.target.value)}
                          >
                            <option value="" disabled>Select…</option>
                            {fm.options.map((o) => (
                              <option key={o.v} value={o.v}>{o.l}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="number"
                            required
                            step={fm.step ?? "any"}
                            min={fm.min}
                            max={fm.max}
                            value={form[f] ?? ""}
                            onChange={(e) => update(f, e.target.value)}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <button className="btn btn-primary" disabled={busy} style={{ marginTop: 18 }}>
            {busy ? "Running model…" : "Run screening"}
          </button>
        </form>

        <div className="card card-pad">
          <p className="eyebrow" style={{ marginBottom: 14 }}>Result</p>
          {result ? (
            <>
              <div className="result-chip-wrap">
                <span className={`result-chip ${isBorderline ? "borderline" : isRisk ? "attention" : "clear"}`}>
                  {isBorderline ? <HelpCircleIcon /> : isRisk ? <AlertTriangleIcon /> : <CheckCircleIcon />}
                  {result.prediction}
                </span>
              </div>
              <RiskGauge value={result.probability} risk={isRisk} borderline={isBorderline} />
              <p className="result-sub">confidence · model: {result.model_used}</p>
              {isBorderline && (
                <p className="result-note" style={{ color: "var(--risk-mid)" }}>
                  Close to the decision boundary — treat as inconclusive rather than a
                  confident result. Consider retesting or consulting a clinician.
                </p>
              )}

              <button
                type="button"
                className="btn btn-ghost btn-block"
                style={{ marginTop: 14 }}
                onClick={exportPdf}
                disabled={exporting}
              >
                <DownloadIcon width={15} height={15} />
                {exporting ? "Preparing PDF…" : "Export as PDF"}
              </button>

              {result.explanation ? (
                <div className="explanation-block">
                  <p className="eyebrow" style={{ marginTop: 18, marginBottom: 8 }}>What drove this result</p>
                  <ul className="explanation-list">
                    {result.explanation.map((item) => {
                      const pushesRisk = item.contribution > 0;
                      const magnitude = Math.min(100, Math.abs(item.contribution) * 40);
                      return (
                        <li key={item.feature} className="explanation-item">
                          <span className="explanation-feature">{item.feature}</span>
                          <span className="explanation-bar-track">
                            <span
                              className="explanation-bar"
                              style={{
                                width: `${Math.max(8, magnitude)}%`,
                                background: pushesRisk ? "var(--risk-high)" : "var(--risk-low)",
                              }}
                            />
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="explanation-legend">
                    <span><i style={{ background: "var(--risk-high)" }} />pushes toward this result</span>
                    <span><i style={{ background: "var(--risk-low)" }} />pushes away from it</span>
                  </div>
                </div>
              ) : (
                <p className="result-sub" style={{ marginTop: 14 }}>
                  No feature breakdown available for this model type.
                </p>
              )}

              <div style={{ marginTop: 18 }}>
                {metrics && (
                  <>
                    <div className="stat-line"><span>Model accuracy</span><span>{(metrics.accuracy * 100).toFixed(1)}%</span></div>
                    <div className="stat-line"><span>Precision</span><span>{(metrics.precision * 100).toFixed(1)}%</span></div>
                    <div className="stat-line"><span>Recall</span><span>{(metrics.recall * 100).toFixed(1)}%</span></div>
                    <div className="stat-line"><span>ROC-AUC</span><span>{(metrics.roc_auc * 100).toFixed(1)}%</span></div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="empty-state" style={{ padding: "30px 10px" }}>
              <p style={{ fontSize: 13.5 }}>Fill in the panel and run a screening to see the result here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
