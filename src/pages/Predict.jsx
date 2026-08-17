import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { api } from "../api/client";
import { DISEASE_META, getFieldMeta, groupFields } from "../diseaseConfig";
import RiskGauge from "../components/RiskGauge";
import AISuggestionCard from "../components/AISuggestionCard";
import Reveal, { StaggerGroup } from "../components/Reveal";
import { fadeUp, slideInLeft, slideInRight, hoverLift, tapScale } from "../lib/motion";
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
  const [csvName, setCsvName] = useState("");
  const [pdfName, setPdfName] = useState("");
  const [dragCsv, setDragCsv] = useState(false);
  const [dragPdf, setDragPdf] = useState(false);
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

  const runCsvUpload = async (file) => {
    if (!file) return;
    setCsvName(file.name);
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
  const uploadCsv = (e) => runCsvUpload(e.target.files?.[0]);
  const onCsvDrop = (e) => {
    e.preventDefault();
    setDragCsv(false);
    runCsvUpload(e.dataTransfer.files?.[0]);
  };

  const runPdfUpload = async (file) => {
    if (!file) return;
    setPdfName(file.name);
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
  const uploadPdf = (e) => runPdfUpload(e.target.files?.[0]);
  const onPdfDrop = (e) => {
    e.preventDefault();
    setDragPdf(false);
    runPdfUpload(e.dataTransfer.files?.[0]);
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

      <StaggerGroup as="div" className="upload-panel" stagger={0.08}>
        <Reveal
          as="label"
          htmlFor="csv-upload"
          className={`upload-card${dragCsv ? " drag-active" : ""}`}
          variants={fadeUp}
          whileHover={hoverLift}
          onDragOver={(e) => { e.preventDefault(); setDragCsv(true); }}
          onDragLeave={() => setDragCsv(false)}
          onDrop={onCsvDrop}
        >
          <motion.span
            className="upload-icon"
            animate={dragCsv ? { scale: 1.12, y: -2 } : { scale: 1, y: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <UploadIcon />
          </motion.span>
          <div className="upload-copy">
            <p className="upload-title">Have a lab export?</p>
            <p className="upload-sub">Upload a single-row CSV to auto-fill and predict — or drag it in.</p>
          </div>
          <input ref={csvRef} id="csv-upload" className="upload-input-hidden" type="file" accept=".csv" onChange={uploadCsv} />
          <motion.span className="upload-btn" whileHover={hoverLift} whileTap={tapScale}>
            <UploadIcon width={13} height={13} /> Choose CSV
          </motion.span>
          <AnimatePresence>
            {csvName && (
              <motion.span
                className="upload-filename"
                initial={{ opacity: 0, scale: 0.9, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              >
                <CheckCircleIcon width={13} height={13} /> {csvName}
              </motion.span>
            )}
          </AnimatePresence>
        </Reveal>

        <Reveal
          as="label"
          htmlFor="pdf-upload"
          className={`upload-card${dragPdf ? " drag-active" : ""}`}
          variants={fadeUp}
          whileHover={hoverLift}
          onDragOver={(e) => { e.preventDefault(); setDragPdf(true); }}
          onDragLeave={() => setDragPdf(false)}
          onDrop={onPdfDrop}
        >
          <motion.span
            className="upload-icon"
            animate={dragPdf ? { scale: 1.12, y: -2 } : { scale: 1, y: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <FileTextIcon />
          </motion.span>
          <div className="upload-copy">
            <p className="upload-title">Have a lab report PDF?</p>
            <p className="upload-sub">Best-effort field extraction — or drag it in.</p>
          </div>
          <input ref={pdfRef} id="pdf-upload" className="upload-input-hidden" type="file" accept=".pdf" onChange={uploadPdf} />
          <motion.span className="upload-btn" whileHover={hoverLift} whileTap={tapScale}>
            <FileTextIcon width={13} height={13} /> Choose PDF
          </motion.span>
          <AnimatePresence>
            {pdfName && (
              <motion.span
                className="upload-filename"
                initial={{ opacity: 0, scale: 0.9, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              >
                <CheckCircleIcon width={13} height={13} /> {pdfName}
              </motion.span>
            )}
          </AnimatePresence>
        </Reveal>
      </StaggerGroup>

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
        <Reveal as="form" className="card card-pad" variants={slideInLeft} onSubmit={submit}>
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
          <motion.button
            className="btn btn-primary"
            disabled={busy}
            style={{ marginTop: 18 }}
            whileHover={busy ? undefined : hoverLift}
            whileTap={busy ? undefined : tapScale}
          >
            {busy ? (
              <motion.span
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
              >
                Running model…
              </motion.span>
            ) : (
              "Run screening"
            )}
          </motion.button>
        </Reveal>

        <Reveal as="div" className="card card-pad" variants={slideInRight}>
          <p className="eyebrow" style={{ marginBottom: 14 }}>Result</p>
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="result-chip-wrap">
                  <motion.span
                    className={`result-chip ${isBorderline ? "borderline" : isRisk ? "attention" : "clear"}`}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
                  >
                    {isBorderline ? <HelpCircleIcon /> : isRisk ? <AlertTriangleIcon /> : <CheckCircleIcon />}
                    {result.prediction}
                  </motion.span>
                </div>
                <RiskGauge value={result.probability} risk={isRisk} borderline={isBorderline} />
                <p className="result-sub">confidence · model: {result.model_used}</p>
                {isBorderline && (
                  <p className="result-note" style={{ color: "var(--risk-mid)" }}>
                    Close to the decision boundary — treat as inconclusive rather than a
                    confident result. Consider retesting or consulting a clinician.
                  </p>
                )}

                <motion.button
                  type="button"
                  className="btn btn-ghost btn-block"
                  style={{ marginTop: 14 }}
                  onClick={exportPdf}
                  disabled={exporting}
                  whileHover={exporting ? undefined : hoverLift}
                  whileTap={exporting ? undefined : tapScale}
                >
                  <DownloadIcon width={15} height={15} />
                  {exporting ? "Preparing PDF…" : "Export as PDF"}
                </motion.button>

                {result.explanation ? (
                  <div className="explanation-block">
                    <p className="eyebrow" style={{ marginTop: 18, marginBottom: 8 }}>What drove this result</p>
                    <motion.ul
                      className="explanation-list"
                      initial="hidden"
                      animate="visible"
                      variants={{ visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } } }}
                    >
                      {result.explanation.map((item) => {
                        const pushesRisk = item.contribution > 0;
                        const magnitude = Math.min(100, Math.abs(item.contribution) * 40);
                        return (
                          <motion.li key={item.feature} className="explanation-item" variants={fadeUp}>
                            <span className="explanation-feature">{item.feature}</span>
                            <span className="explanation-bar-track">
                              <motion.span
                                className="explanation-bar"
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.max(8, magnitude)}%` }}
                                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                style={{
                                  background: pushesRisk ? "var(--risk-high)" : "var(--risk-low)",
                                }}
                              />
                            </span>
                          </motion.li>
                        );
                      })}
                    </motion.ul>
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

                <AISuggestionCard resultId={result.id} />
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                className="empty-state"
                style={{ padding: "30px 10px" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <p style={{ fontSize: 13.5 }}>Fill in the panel and run a screening to see the result here.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </div>
  );
}
