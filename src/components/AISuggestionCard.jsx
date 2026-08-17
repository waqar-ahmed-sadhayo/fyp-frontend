import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";
import { api } from "../api/client";
import Reveal from "./Reveal";
import { fadeUp, hoverLift, tapScale } from "../lib/motion";
import { AlertTriangleIcon, SparkleIcon } from "./Icons";

// Self-contained: owns its own idle/loading/loaded/error state so Predict.jsx
// and History.jsx can both just drop it in with a resultId, no state lifting.
export default function AISuggestionCard({ resultId }) {
  const [status, setStatus] = useState("idle"); // idle | loading | loaded | error
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const fetchSuggestion = async () => {
    setStatus("loading");
    setError("");
    try {
      const res = await api.healthSuggestions(resultId);
      setData(res);
      setStatus("loaded");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  };

  if (status === "idle") {
    return (
      <motion.button
        type="button"
        className="btn btn-ghost ai-suggest-btn"
        onClick={fetchSuggestion}
        whileHover={hoverLift}
        whileTap={tapScale}
      >
        <SparkleIcon width={15} height={15} /> AI Suggestions Lein
      </motion.button>
    );
  }

  return (
    <Reveal as="div" className="ai-suggestion-card" variants={fadeUp}>
      <div className="ai-suggestion-header">
        <span className="ai-suggestion-icon"><SparkleIcon width={15} height={15} /></span>
        <p className="eyebrow" style={{ margin: 0 }}>AI Suggestions</p>
      </div>

      <AnimatePresence mode="wait">
        {status === "loading" && (
          <motion.div
            key="loading"
            className="ai-suggestion-loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.span
              className="ai-suggestion-spinner"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            />
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            >
              AI aapki report samajh raha hai…
            </motion.span>
          </motion.div>
        )}

        {status === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="error-banner">{error}</div>
            <motion.button
              type="button"
              className="btn btn-ghost"
              style={{ marginTop: 10 }}
              onClick={fetchSuggestion}
              whileHover={hoverLift}
              whileTap={tapScale}
            >
              Retry
            </motion.button>
          </motion.div>
        )}

        {status === "loaded" && data && (
          <motion.div
            key="loaded"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {data.is_emergency && (
              <motion.div
                className="ai-emergency-banner"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                <AlertTriangleIcon width={16} height={16} />
                Yeh alarming lag sakta hai — agar aapko chest pain, saans ki takleef ya
                heavy bleeding ho raha hai to foran hospital/emergency jayen.
              </motion.div>
            )}
            <div className="ai-suggestion-body">
              <ReactMarkdown>{data.suggestion}</ReactMarkdown>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Reveal>
  );
}
