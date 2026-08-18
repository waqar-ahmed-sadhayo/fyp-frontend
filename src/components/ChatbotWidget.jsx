import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import ReactMarkdown from "react-markdown";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { hoverLift, tapScale } from "../lib/motion";
import { AlertTriangleIcon, ChatbotMascotIcon, DoctorIcon, SendIcon } from "./Icons";

const STORAGE_KEY = "mdds_chat_history";

// `local: true` marks messages that only ever exist in the browser (the
// canned greeting) — never sent to the backend, since the Anthropic API
// requires a conversation to start with a real "user" turn.
const GREETING = {
  role: "assistant",
  local: true,
  content: "Assalam-o-Alaikum! Main MDDS Assistant hoon — website use karne mein madad chahiye ho ya koi health se related sawaal ho, be-jhijhak poochein.",
};

function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw && JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length) return parsed;
  } catch {
    /* corrupt storage — fall through to a fresh greeting */
  }
  return [GREETING];
}

export default function ChatbotWidget() {
  const { user } = useAuth();
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(loadHistory);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      /* storage unavailable (private mode, quota) — chat still works, just isn't persisted */
    }
  }, [messages]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, busy, open]);

  const runChat = async (list) => {
    setError("");
    setBusy(true);
    try {
      const payload = list.filter((m) => !m.local).map(({ role, content }) => ({ role, content }));
      const res = await api.assistantChat(payload);
      setMessages((cur) => [...cur, { role: "assistant", content: res.reply, isEmergency: res.is_emergency }]);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const send = () => {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    const next = [...messages, { role: "user", content: text }];
    setMessages(next);
    runChat(next);
  };

  const retry = () => runChat(messages);

  const newChat = () => {
    setMessages([GREETING]);
    setError("");
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      <motion.button
        type="button"
        className="chatbot-fab"
        onClick={() => setOpen((o) => !o)}
        animate={!reduceMotion && !open ? { y: [0, -7, 0] } : { y: 0 }}
        transition={!reduceMotion && !open ? { duration: 2.2, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 }}
        whileHover={hoverLift}
        whileTap={tapScale}
        aria-label={open ? "Close assistant" : "Open assistant"}
      >
        <ChatbotMascotIcon width={68} height={68} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="chatbot-panel"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="chatbot-header">
              <span className="chatbot-header-icon"><DoctorIcon width={18} height={18} /></span>
              <div className="chatbot-header-copy">
                <p className="chatbot-header-title">MDDS Assistant</p>
                <p className="chatbot-header-sub">Website guide &amp; general health Q&amp;A</p>
              </div>
              <button type="button" className="chatbot-newchat" onClick={newChat}>New chat</button>
            </div>

            <div className="chatbot-messages" ref={scrollRef}>
              {messages.map((m, i) => (
                <div key={i} className={`chatbot-msg ${m.role}`}>
                  {m.role === "assistant" ? (
                    <div className="ai-suggestion-body"><ReactMarkdown>{m.content}</ReactMarkdown></div>
                  ) : (
                    m.content
                  )}
                  {m.isEmergency && (
                    <div className="ai-emergency-banner chatbot-emergency">
                      <AlertTriangleIcon width={15} height={15} />
                      Agar symptoms serious hain, foran hospital/emergency jayen.
                    </div>
                  )}
                </div>
              ))}

              {busy && (
                <div className="chatbot-msg assistant chatbot-typing">
                  <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }} />
                  <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.2 }} />
                  <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.4 }} />
                </div>
              )}

              {error && (
                <div className="chatbot-error">
                  <div className="error-banner">{error}</div>
                  <motion.button
                    type="button"
                    className="btn btn-ghost"
                    onClick={retry}
                    whileHover={hoverLift}
                    whileTap={tapScale}
                  >
                    Retry
                  </motion.button>
                </div>
              )}
            </div>

            {user ? (
              <div className="chatbot-input-row">
                <textarea
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Apna sawaal likhein…"
                  disabled={busy}
                />
                <motion.button
                  type="button"
                  className="chatbot-send"
                  onClick={send}
                  disabled={busy || !input.trim()}
                  whileHover={busy || !input.trim() ? undefined : hoverLift}
                  whileTap={busy || !input.trim() ? undefined : tapScale}
                  aria-label="Send"
                >
                  <SendIcon width={16} height={16} />
                </motion.button>
              </div>
            ) : (
              <div className="chatbot-signin-prompt">
                <p>Sawaal poochne ke liye sign in karein.</p>
                <div className="chatbot-signin-actions">
                  <Link to="/login" className="btn btn-primary btn-sm">Sign in</Link>
                  <Link to="/register" className="btn btn-ghost btn-sm">Create account</Link>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
