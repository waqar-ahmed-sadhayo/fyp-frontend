import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";
import { DISEASE_META } from "../diseaseConfig";
import ScreeningCard from "../components/ScreeningCard";
import DashboardPreview from "../components/DashboardPreview";
import Reveal, { StaggerGroup } from "../components/Reveal";
import { fadeUp, scaleIn, hoverLift, tapScale } from "../lib/motion";
import {
  ArrowRightIcon,
  BadgeCheckIcon,
  BookOpenIcon,
  ClipboardIcon,
  DatabaseIcon,
  DiseaseIcon,
  LayersIcon,
  PulseIcon,
  SendIcon,
  ShieldIcon,
  SparkleIcon,
  UploadIcon,
  UserIcon,
} from "../components/Icons";

const MotionLink = motion.create(Link);

const HERO_FEATURES = [
  { icon: SparkleIcon, title: "AI-powered", sub: "Trained on real datasets" },
  { icon: ShieldIcon, title: "Secure & private", sub: "Your data stays yours" },
  { icon: PulseIcon, title: "Instant results", sub: "In a few seconds" },
  { icon: LayersIcon, title: "5 diseases", sub: "One account" },
];

function truncate(text, max) {
  if (!text || text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, "") + "…";
}

const STEPS = [
  {
    icon: UserIcon,
    title: "Create an account",
    body: "Register with just an email and password — no medical ID or insurance details needed.",
  },
  {
    icon: LayersIcon,
    title: "Choose a screening",
    body: "Pick one of five diseases from your dashboard: heart, diabetes, breast cancer, kidney or liver.",
  },
  {
    icon: UploadIcon,
    title: "Enter your panel or upload a CSV",
    body: "Fill in the lab values by hand, or upload a single-row CSV export with matching column headers.",
  },
  {
    icon: BadgeCheckIcon,
    title: "Get a confidence-scored result",
    body: "See a risk label, a probability score, and the model's own accuracy — then decide if it's worth a doctor's visit.",
  },
];

const TEAM = [
  { name: "Haroon Rasheed", rollNo: "BSE-22F-071" },
  { name: "Waqar Ahmed", rollNo: "BSE-22F-076" },
];

function initials(name) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase();
}

const FAQS = [
  {
    q: "Is this a medical diagnosis?",
    a: "No. Every result here is a preliminary screening estimate from a machine learning model, not a diagnosis. It is not a substitute for professional medical advice — always confirm any elevated result with a licensed clinician.",
  },
  {
    q: "What data do I need to run a screening?",
    a: "Standard lab or clinical values for the disease you're checking — e.g. cholesterol and resting blood pressure for heart disease, or glucose and BMI for diabetes. The screening form shows exactly which fields each model expects before you start.",
  },
  {
    q: "Can I upload a report instead of typing values in?",
    a: "Yes — a single-row CSV export with column headers matching the model's fields will auto-fill the form and run the prediction. PDF report upload isn't supported yet.",
  },
  {
    q: "Is my data shared with anyone?",
    a: "No. Your account and results are private to you. Passwords are hashed with bcrypt, sessions use short-lived JWTs, and nothing is sold or shared with third parties.",
  },
  {
    q: "How accurate are the models?",
    a: "It varies by disease — see the performance table above. All five are trained and evaluated on public clinical datasets, not certified medical devices, and some (heart, diabetes, liver) are below our 85% accuracy target and still being improved.",
  },
];

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [schema, setSchema] = useState(null);
  const [diseaseInfo, setDiseaseInfo] = useState(null);
  const [pick, setPick] = useState("heart");

  useEffect(() => {
    api
      .diseases()
      .then(setSchema)
      .catch(() => {});
    api
      .diseasesInfo()
      .then(setDiseaseInfo)
      .catch(() => {});
  }, []);

  const startScreening = () =>
    navigate(user ? `/predict/${pick}` : "/register");
  const bestAccuracy = schema
    ? Math.max(...Object.values(schema).map((d) => d.metrics?.accuracy || 0))
    : null;

  return (
    <>
      <div className="hero-banner">
        <div className="hero-banner-inner">
          <section className="hero">
            <StaggerGroup as="div" className="hero-content" stagger={0.09}>
              <motion.span className="hero-badge" variants={fadeUp}>
                <SparkleIcon /> AI-powered screening
              </motion.span>
              <motion.h1 variants={fadeUp}>
                Smart Detection,
                <br />
                <span style={{ color: "var(--brand-dark)" }}>Better Awareness.</span>
              </motion.h1>
              <motion.p className="lede" variants={fadeUp}>
                Multi-Disease Detection System uses trained AI models to screen
                your lab panel and support early awareness — for heart disease,
                diabetes, breast cancer, kidney disease and liver disease.
              </motion.p>

              <motion.div className="hero-actions" variants={fadeUp}>
                <MotionLink
                  to={user ? "/dashboard" : "/register"}
                  className="btn btn-primary"
                  whileHover={hoverLift}
                  whileTap={tapScale}
                >
                  <UploadIcon width={16} height={16} />{" "}
                  {user ? "Upload a report" : "Create an account"}
                </MotionLink>
                <motion.a
                  href="#how-it-works"
                  className="btn btn-ghost"
                  whileHover={hoverLift}
                  whileTap={tapScale}
                >
                  See how it works
                </motion.a>
              </motion.div>

              <motion.div className="trust-row" variants={fadeUp}>
                <span className="trust-row-item">
                  <ShieldIcon /> Private &amp; encrypted data
                </span>
                <span className="trust-row-item">
                  <DatabaseIcon /> Trained on verified public clinical datasets
                </span>
                <span className="trust-row-item">
                  <LayersIcon /> 5 conditions, one account
                </span>
              </motion.div>

              <motion.div className="hero-feature-row" variants={fadeUp}>
                {HERO_FEATURES.map((f) => (
                  <div className="hf-item" key={f.title}>
                    <span className="hf-icon">
                      <f.icon />
                    </span>
                    <div>
                      <h5>{f.title}</h5>
                      <p>{f.sub}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </StaggerGroup>

            <Reveal as="div" className="hero-visual" variants={scaleIn}>
              <DashboardPreview />
            </Reveal>
          </section>

          <Reveal as="div" className="quick-start">
            <div className="field">
              <label>Screening</label>
              <select value={pick} onChange={(e) => setPick(e.target.value)}>
                {Object.entries(DISEASE_META).map(([key, meta]) => (
                  <option key={key} value={key}>
                    {meta.label}
                  </option>
                ))}
              </select>
            </div>
            <motion.button
              className="btn btn-primary"
              onClick={startScreening}
              whileHover={hoverLift}
              whileTap={tapScale}
            >
              {user ? "Start screening" : "Create an account"}
            </motion.button>
          </Reveal>
        </div>
      </div>

      <div className="shell-inner">
        <Reveal as="div" className="disclaimer" style={{ marginTop: 76 }}>
          Educational preliminary-screening tool only — not a certified
          diagnostic device. Results should be discussed with a qualified
          healthcare professional.
        </Reveal>

        <StaggerGroup as="div" className="trust-bar">
          <motion.div className="t-item" variants={fadeUp}>
            <span className="t-icon">
              <PulseIcon />
            </span>
            <div>
              <h5>Instant results</h5>
              <p>No waiting room</p>
            </div>
          </motion.div>
          <motion.div className="t-item" variants={fadeUp}>
            <span className="t-icon">
              <ShieldIcon />
            </span>
            <div>
              <h5>Private data</h5>
              <p>Yours alone</p>
            </div>
          </motion.div>
          <motion.div className="t-item" variants={fadeUp}>
            <span className="t-icon">
              <LayersIcon />
            </span>
            <div>
              <h5>5 conditions</h5>
              <p>One account</p>
            </div>
          </motion.div>
          <motion.div className="t-item" variants={fadeUp}>
            <span className="t-icon">
              <BadgeCheckIcon />
            </span>
            <div>
              <h5>Free to use</h5>
              <p>Always</p>
            </div>
          </motion.div>
        </StaggerGroup>

        {/* ---- screen for a condition (category grid) ---- */}
        <section className="landing-section">
          <Reveal as="div" className="section-head">
            <div>
              <p className="eyebrow">Get started</p>
              <h2>Screen for a condition</h2>
            </div>
            <Link
              to={user ? "/dashboard" : "/register"}
              style={{ fontSize: 13, fontWeight: 600 }}
            >
              View all →
            </Link>
          </Reveal>
          <StaggerGroup as="div" className="category-grid">
            {Object.entries(DISEASE_META).map(([key, meta]) => (
              <MotionLink
                key={key}
                to={user ? `/predict/${key}` : "/register"}
                className="category-tile"
                variants={fadeUp}
                whileHover={hoverLift}
                whileTap={tapScale}
              >
                <span
                  className="c-icon"
                  style={{ background: `color-mix(in srgb, ${meta.color} 12%, transparent)`, color: meta.color }}
                >
                  <DiseaseIcon disease={key} />
                </span>
                <span className="label">{meta.label}</span>
              </MotionLink>
            ))}
            <MotionLink
              to={user ? "/history" : "/login"}
              className="category-tile"
              variants={fadeUp}
              whileHover={hoverLift}
              whileTap={tapScale}
            >
              <span
                className="c-icon"
                style={{
                  background: "var(--brand-wash)",
                  color: "var(--brand)",
                }}
              >
                <ClipboardIcon />
              </span>
              <span className="label">History</span>
            </MotionLink>
            <MotionLink
              to="/education"
              className="category-tile"
              variants={fadeUp}
              whileHover={hoverLift}
              whileTap={tapScale}
            >
              <span
                className="c-icon"
                style={{
                  background: "var(--brand-wash)",
                  color: "var(--brand)",
                }}
              >
                <BookOpenIcon />
              </span>
              <span className="label">Learn</span>
            </MotionLink>
          </StaggerGroup>
        </section>

        {/* ---- learn (education preview, one row) ---- */}
        <section className="landing-section">
          <Reveal as="div" className="section-head">
            <div>
              <p className="eyebrow">Education</p>
              <h2>Learn about each condition</h2>
            </div>
            <Link to="/education" style={{ fontSize: 13, fontWeight: 600 }}>
              View all →
            </Link>
          </Reveal>
          <StaggerGroup as="div" className="learn-row">
            {Object.entries(DISEASE_META).map(([key, meta]) => {
              const info = diseaseInfo?.[key];
              return (
                <MotionLink
                  key={key}
                  to="/education"
                  className="learn-card"
                  variants={fadeUp}
                  whileHover={hoverLift}
                  whileTap={tapScale}
                >
                  <span
                    className="icon-badge"
                    style={{ background: `color-mix(in srgb, ${meta.color} 12%, transparent)`, color: meta.color }}
                  >
                    <DiseaseIcon disease={key} />
                  </span>
                  <h4>{meta.label}</h4>
                  <p>{info ? truncate(info.overview, 84) : "Loading…"}</p>
                  <span className="learn-more">
                    Read more <ArrowRightIcon />
                  </span>
                </MotionLink>
              );
            })}
          </StaggerGroup>
        </section>

        {/* ---- disease showcase (product-card style) ---- */}
        <section className="landing-section">
          <Reveal as="div" className="section-head">
            <div>
              <p className="eyebrow">Coverage</p>
              <h2>Five screenings, one account</h2>
            </div>
            <p>Metrics measured on a held-out test split, per model.</p>
          </Reveal>
          <StaggerGroup as="div" className="disease-grid">
            {Object.entries(DISEASE_META).map(([key, meta]) => (
              <ScreeningCard
                key={key}
                diseaseKey={key}
                meta={meta}
                metrics={schema?.[key]?.metrics}
                to={user ? `/predict/${key}` : "/register"}
              />
            ))}
          </StaggerGroup>
        </section>

        {/* ---- promo banner ---- */}
        <Reveal as="div" className="promo-banner">
          <div>
            <span className="p-icon">
              <UploadIcon />
            </span>
            <h2>Already have a lab report?</h2>
            <p>
              Upload a CSV export and we'll auto-fill the panel and run the
              screening for you.
            </p>
            <MotionLink
              to={user ? "/dashboard" : "/register"}
              className="btn btn-primary"
              whileHover={hoverLift}
              whileTap={tapScale}
            >
              {user ? "Upload a report" : "Create an account"}
            </MotionLink>
          </div>
          <div className="promo-visual">
            <div className="promo-doc">
              <span className="promo-doc-dot" />
              <span className="promo-doc-dot" />
              <span className="promo-doc-dot" />
              <div className="promo-doc-line w-70" />
              <div className="promo-doc-line w-90" />
              <div className="promo-doc-line w-60" />
              <div className="promo-doc-line w-80" />
              <div className="promo-doc-line w-50" />
            </div>
            <span className="promo-badge">
              <BadgeCheckIcon /> Auto-filled
            </span>
          </div>
        </Reveal>

        <StaggerGroup as="div" className="trust-bar" style={{ marginTop: 20 }}>
          <motion.div className="t-item" variants={fadeUp}>
            <span className="t-icon">
              <BadgeCheckIcon />
            </span>
            <div>
              <h5>Educational use</h5>
              <p>Not a diagnosis</p>
            </div>
          </motion.div>
          <motion.div className="t-item" variants={fadeUp}>
            <span className="t-icon">
              <DatabaseIcon />
            </span>
            <div>
              <h5>Public datasets</h5>
              <p>UCI &amp; Kaggle</p>
            </div>
          </motion.div>
          <motion.div className="t-item" variants={fadeUp}>
            <span className="t-icon">
              <ShieldIcon />
            </span>
            <div>
              <h5>No data resale</h5>
              <p>Ever</p>
            </div>
          </motion.div>
          <motion.div className="t-item" variants={fadeUp}>
            <span className="t-icon">
              <PulseIcon />
            </span>
            <div>
              <h5>Open source spirit</h5>
              <p>Built as a student FYP</p>
            </div>
          </motion.div>
        </StaggerGroup>

        {/* ---- how it works ---- */}
        <section className="landing-section" id="how-it-works">
          <Reveal as="div" className="section-head">
            <div>
              <p className="eyebrow">Process</p>
              <h2>How a screening works</h2>
            </div>
          </Reveal>
          <StaggerGroup as="div" className="steps-grid">
            {STEPS.map((s, i) => (
              <motion.div
                className="card card-pad step-card"
                key={s.title}
                variants={fadeUp}
                whileHover={hoverLift}
              >
                <span className="step-icon">
                  <s.icon />
                </span>
                <span className="step-num">{i + 1}</span>
                <h4>{s.title}</h4>
                <p>{s.body}</p>
              </motion.div>
            ))}
          </StaggerGroup>
        </section>

        {/* ---- model performance transparency table ---- */}
        <section className="landing-section">
          <Reveal as="div" className="section-head">
            <div>
              <p className="eyebrow">Transparency</p>
              <h2>Model performance, in full</h2>
            </div>
          </Reveal>
          <Reveal as="div" className="card" style={{ overflowX: "auto" }}>
            <table className="history-table perf-table">
              <thead>
                <tr>
                  <th>Screening</th>
                  <th>Model</th>
                  <th>Accuracy</th>
                  <th>F1</th>
                  <th>ROC-AUC</th>
                  <th>85% target</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(DISEASE_META).map(([key, meta]) => {
                  const m = schema?.[key]?.metrics;
                  const meets = m && m.accuracy >= 0.85;
                  return (
                    <tr key={key}>
                      <td>{meta.label}</td>
                      <td className="mono" style={{ color: "var(--muted)" }}>
                        {m?.chosen_model ?? "—"}
                      </td>
                      <td className="mono">
                        {m ? `${(m.accuracy * 100).toFixed(1)}%` : "—"}
                      </td>
                      <td className="mono">
                        {m ? `${(m.f1 * 100).toFixed(1)}%` : "—"}
                      </td>
                      <td className="mono">
                        {m ? `${(m.roc_auc * 100).toFixed(1)}%` : "—"}
                      </td>
                      <td
                        className={m ? (meets ? "meets-yes" : "meets-no") : ""}
                      >
                        {m ? (meets ? "Meets target" : "Below target") : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Reveal>
          {/* <p className="perf-note">
          Shown as measured, not curated — heart, diabetes and liver currently sit below the 85%
          accuracy target and are still being tuned. Kidney and breast cancer are trained on small,
          well-separated public datasets, so treat their near-perfect scores as a demonstration
          result rather than a validated real-world capability.
        </p> */}
        </section>

        {/* ---- bottom action cards ---- */}
        <StaggerGroup as="div" className="bottom-cards">
          <MotionLink
            to="/education"
            className="bottom-card light"
            variants={fadeUp}
            whileHover={hoverLift}
            whileTap={tapScale}
          >
            <span className="bc-icon">
              <BookOpenIcon />
            </span>
            <h4>Learn about your results</h4>
            <p>
              Symptoms, risk factors and prevention for all five conditions.
            </p>
            <span className="bc-cta">
              Visit the Learn page <ArrowRightIcon />
            </span>
          </MotionLink>
          <MotionLink
            to={user ? "/history" : "/login"}
            className="bottom-card light"
            variants={fadeUp}
            whileHover={hoverLift}
            whileTap={tapScale}
          >
            <span className="bc-icon">
              <ClipboardIcon />
            </span>
            <h4>Track your history</h4>
            <p>Every screening you run is saved to your account, privately.</p>
            <span className="bc-cta">
              View history <ArrowRightIcon />
            </span>
          </MotionLink>
          <MotionLink
            to={user ? "/feedback" : "/register"}
            className="bottom-card dark"
            variants={fadeUp}
            whileHover={hoverLift}
            whileTap={tapScale}
          >
            <span className="bc-icon">
              <SendIcon />
            </span>
            <h4>Found a bug or have an idea?</h4>
            <p>
              This is a student project — feedback genuinely shapes what gets
              built next.
            </p>
            <span className="bc-cta">
              Send feedback <ArrowRightIcon />
            </span>
          </MotionLink>
        </StaggerGroup>

        {/* ---- real-facts stat strip ---- */}
        <StaggerGroup as="div" className="stats-strip">
          <motion.div className="s-item" variants={fadeUp}>
            <span className="s-icon">
              <LayersIcon />
            </span>
            <div className="s-num">5</div>
            <div className="s-label">Diseases screened</div>
          </motion.div>
          <motion.div className="s-item" variants={fadeUp}>
            <span className="s-icon">
              <DatabaseIcon />
            </span>
            <div className="s-num">300–770</div>
            <div className="s-label">Rows per training dataset</div>
          </motion.div>
          <motion.div className="s-item" variants={fadeUp}>
            <span className="s-icon">
              <BadgeCheckIcon />
            </span>
            <div className="s-num">
              {bestAccuracy ? `${(bestAccuracy * 100).toFixed(1)}%` : "—"}
            </div>
            <div className="s-label">Best model accuracy</div>
          </motion.div>
          <motion.div className="s-item" variants={fadeUp}>
            <span className="s-icon">
              <ShieldIcon />
            </span>
            <div className="s-num">100%</div>
            <div className="s-label">Free &amp; educational</div>
          </motion.div>
        </StaggerGroup>

        {/* ---- team ---- */}
        <section className="landing-section">
          <Reveal as="div" className="section-head">
            <div>
              <p className="eyebrow">Team</p>
              <h2>Built by</h2>
            </div>
          </Reveal>
          <StaggerGroup as="div" className="team-grid">
            {TEAM.map((m) => (
              <motion.div
                className="team-card"
                key={m.rollNo}
                variants={fadeUp}
                whileHover={hoverLift}
              >
                <span className="team-avatar">{initials(m.name)}</span>
                <div>
                  <div className="team-name">{m.name}</div>
                  <div className="team-roll">{m.rollNo}</div>
                </div>
              </motion.div>
            ))}
          </StaggerGroup>
        </section>

        {/* ---- faq ---- */}
        <section className="landing-section">
          <Reveal as="div" className="section-head">
            <div>
              <p className="eyebrow">Questions</p>
              <h2>Frequently asked</h2>
            </div>
          </Reveal>
          <StaggerGroup as="div" className="faq-list" stagger={0.05}>
            {FAQS.map((f) => (
              <motion.details className="faq-item" key={f.q} variants={fadeUp}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </motion.details>
            ))}
          </StaggerGroup>
        </section>

        {/* ---- closing cta ---- */}
        <Reveal as="div" className="cta-band">
          <h2>
            {user
              ? "Ready for your next screening?"
              : "Create an account and run your first screening"}
          </h2>
          <p>Free, educational, and takes under a minute to get a result.</p>
          <div className="hero-actions on-dark" style={{ justifyContent: "center" }}>
            <MotionLink
              to={user ? "/dashboard" : "/register"}
              className="btn btn-primary"
              whileHover={hoverLift}
              whileTap={tapScale}
            >
              {user ? "Go to screening" : "Get started"}
            </MotionLink>
            {!user && (
              <MotionLink
                to="/login"
                className="btn btn-ghost"
                whileHover={hoverLift}
                whileTap={tapScale}
              >
                Sign in
              </MotionLink>
            )}
          </div>
        </Reveal>
      </div>
    </>
  );
}
