import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { api } from "../api/client";
import RiskGauge from "../components/RiskGauge";
import AISuggestionCard from "../components/AISuggestionCard";
import Reveal, { StaggerGroup } from "../components/Reveal";
import { fadeUp, slideInLeft, slideInRight, hoverLift, tapScale } from "../lib/motion";
import {
  AlertTriangleIcon, CheckCircleIcon, DiseaseIcon, FileTextIcon, UploadIcon,
} from "../components/Icons";

export default function KidneyStoneScan() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [imageName, setImageName] = useState("");
  const [pdfName, setPdfName] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [dragImage, setDragImage] = useState(false);
  const [dragPdf, setDragPdf] = useState(false);
  const imageRef = useRef(null);
  const pdfRef = useRef(null);

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const runUpload = async (file, { isImage }) => {
    if (!file) return;
    setError("");
    setBusy(true);
    if (isImage) {
      setImageName(file.name);
      setPdfName("");
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPdfName(file.name);
      setImageName("");
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    try {
      const res = await api.predictKidneyStone(file);
      setResult(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
      if (imageRef.current) imageRef.current.value = "";
      if (pdfRef.current) pdfRef.current.value = "";
    }
  };

  const onImageChange = (e) => runUpload(e.target.files?.[0], { isImage: true });
  const onPdfChange = (e) => runUpload(e.target.files?.[0], { isImage: false });
  const onImageDrop = (e) => {
    e.preventDefault();
    setDragImage(false);
    runUpload(e.dataTransfer.files?.[0], { isImage: true });
  };
  const onPdfDrop = (e) => {
    e.preventDefault();
    setDragPdf(false);
    runUpload(e.dataTransfer.files?.[0], { isImage: false });
  };

  const isStone = result?.prediction === "stone";

  return (
    <div className="shell-inner">
      <p className="eyebrow">Kidney Stone Screening</p>
      <h2>CT scan screening</h2>

      <div className="disclaimer">
        Preliminary screening only, from a CT scan image — not a certified
        diagnostic device. Confirm any result with a licensed radiologist
        or urologist before acting on it.
      </div>

      <StaggerGroup as="div" className="upload-panel" stagger={0.08}>
        <Reveal
          as="label"
          htmlFor="stone-image-upload"
          className={`upload-card${dragImage ? " drag-active" : ""}`}
          variants={fadeUp}
          whileHover={hoverLift}
          onDragOver={(e) => { e.preventDefault(); setDragImage(true); }}
          onDragLeave={() => setDragImage(false)}
          onDrop={onImageDrop}
        >
          <motion.span
            className="upload-icon"
            animate={dragImage ? { scale: 1.12, y: -2 } : { scale: 1, y: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <UploadIcon />
          </motion.span>
          <div className="upload-copy">
            <p className="upload-title">Have a CT scan image?</p>
            <p className="upload-sub">Upload a JPG/PNG — or drag it in.</p>
          </div>
          <input ref={imageRef} id="stone-image-upload" className="upload-input-hidden" type="file" accept=".jpg,.jpeg,.png" onChange={onImageChange} />
          <motion.span className="upload-btn" whileHover={hoverLift} whileTap={tapScale}>
            <UploadIcon width={13} height={13} /> Choose image
          </motion.span>
          <AnimatePresence>
            {imageName && (
              <motion.span
                className="upload-filename"
                initial={{ opacity: 0, scale: 0.9, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              >
                <CheckCircleIcon width={13} height={13} /> {imageName}
              </motion.span>
            )}
          </AnimatePresence>
        </Reveal>

        <Reveal
          as="label"
          htmlFor="stone-pdf-upload"
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
            <p className="upload-title">Have a PDF scan report?</p>
            <p className="upload-sub">First page is used — or drag it in.</p>
          </div>
          <input ref={pdfRef} id="stone-pdf-upload" className="upload-input-hidden" type="file" accept=".pdf" onChange={onPdfChange} />
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

      <div className="predict-layout">
        <Reveal as="div" className="card card-pad" variants={slideInLeft}>
          <p className="eyebrow" style={{ marginBottom: 14 }}>Uploaded scan</p>
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Uploaded CT scan preview"
              style={{ width: "100%", borderRadius: "var(--radius-sm)", border: "1px solid var(--line)" }}
            />
          ) : (
            <div className="empty-state" style={{ padding: "30px 10px" }}>
              <span className="upload-icon" style={{ margin: "0 auto 10px" }}>
                <DiseaseIcon disease="kidney" />
              </span>
              <p style={{ fontSize: 13.5 }}>
                Upload a CT scan image or PDF report to preview it here.
              </p>
            </div>
          )}
        </Reveal>

        <Reveal as="div" className="card card-pad" variants={slideInRight}>
          <p className="eyebrow" style={{ marginBottom: 14 }}>Result</p>
          <AnimatePresence mode="wait">
            {busy ? (
              <motion.div
                key="busy"
                className="empty-state"
                style={{ padding: "30px 10px" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.p
                  style={{ fontSize: 13.5 }}
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
                >
                  Analyzing scan…
                </motion.p>
              </motion.div>
            ) : result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="result-chip-wrap">
                  <motion.span
                    className={`result-chip ${isStone ? "attention" : "clear"}`}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
                  >
                    {isStone ? <AlertTriangleIcon /> : <CheckCircleIcon />}
                    {isStone ? "Stone detected" : "No stone detected"}
                  </motion.span>
                </div>
                <RiskGauge value={result.probability} risk={isStone} />
                <p className="result-sub">confidence · model: {result.model_used}</p>

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
              >
                <p style={{ fontSize: 13.5 }}>Upload a scan to see the result here.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </div>
  );
}
