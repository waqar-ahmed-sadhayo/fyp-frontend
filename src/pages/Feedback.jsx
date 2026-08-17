import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { api } from "../api/client";
import Reveal from "../components/Reveal";
import { hoverLift, tapScale } from "../lib/motion";

export default function Feedback() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await api.submitFeedback({ subject, message });
      setSent(true);
      setSubject("");
      setMessage("");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="shell-inner" style={{ maxWidth: 640 }}>
      <p className="eyebrow">Contact</p>
      <h2>Send feedback</h2>
      <p style={{ color: "var(--muted)", marginTop: 4 }}>
        Found a bug, confusing result, or have a suggestion? Let us know.
      </p>

      {error && <div className="error-banner">{error}</div>}

      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="sent"
            className="card card-pad"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <p style={{ margin: 0, fontWeight: 600, color: "var(--risk-low)" }}>Thanks — your feedback was recorded.</p>
            <motion.button
              className="btn btn-ghost"
              style={{ marginTop: 14 }}
              onClick={() => setSent(false)}
              whileHover={hoverLift}
              whileTap={tapScale}
            >
              Send another
            </motion.button>
          </motion.div>
        ) : (
          <Reveal as="form" key="form" className="card card-pad" onSubmit={submit}>
            <div className="field">
              <label>Subject <span className="hint">optional</span></label>
              <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="What's this about?" />
            </div>
            <div className="field">
              <label>Message</label>
              <textarea
                required
                rows={6}
                maxLength={4000}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what happened…"
                style={{
                  width: "100%", padding: "9px 12px", border: "1px solid var(--line-strong)",
                  borderRadius: "var(--radius-sm)", fontFamily: "var(--font-body)", fontSize: 14,
                  resize: "vertical",
                }}
              />
            </div>
            <motion.button
              className="btn btn-primary"
              disabled={busy}
              whileHover={busy ? undefined : hoverLift}
              whileTap={busy ? undefined : tapScale}
            >
              {busy ? "Sending…" : "Send feedback"}
            </motion.button>
          </Reveal>
        )}
      </AnimatePresence>
    </div>
  );
}
