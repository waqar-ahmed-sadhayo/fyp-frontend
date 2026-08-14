import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";
import { DISEASE_META } from "../diseaseConfig";
import ScreeningCard from "../components/ScreeningCard";
import heroImage from "../assets/hero.png";
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
      <div
        className="hero-banner"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="hero-banner-inner">
          <section className="hero">
            <div className="hero-content">
              <span className="hero-badge">
                <SparkleIcon /> AI-powered screening
              </span>
              <h1>
                Smart Detection,
                <br />
                <span style={{ color: "var(--brand)" }}>Better Awareness.</span>
              </h1>
              <p className="lede">
                Multi-Disease Detection System uses trained AI models to screen
                your lab panel and support early awareness — for heart disease,
                diabetes, breast cancer, kidney disease and liver disease.
              </p>

              <div className="hero-feature-row">
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
              </div>

              <div className="hero-actions">
                <Link
                  to={user ? "/dashboard" : "/register"}
                  className="btn btn-primary"
                >
                  <UploadIcon width={16} height={16} />{" "}
                  {user ? "Upload a report" : "Create an account"}
                </Link>
                <a href="#how-it-works" className="btn btn-ghost">
                  See how it works
                </a>
              </div>

              <div className="hero-stat-line">
                <span className="icon-stack">
                  {Object.entries(DISEASE_META).map(([key, meta]) => (
                    <span
                      key={key}
                      style={{ background: meta.color, color: "#fff" }}
                    >
                      <DiseaseIcon disease={key} width={13} height={13} />
                    </span>
                  ))}
                </span>
                <p>
                  <b>5 screenings</b>, each validated on a public clinical
                  dataset
                </p>
              </div>
            </div>
          </section>

          <div className="quick-start">
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
            <button className="btn btn-primary" onClick={startScreening}>
              {user ? "Start screening" : "Create an account"}
            </button>
          </div>
        </div>
      </div>

      <div className="shell-inner">
        <div className="disclaimer" style={{ marginTop: 76 }}>
          Educational preliminary-screening tool only — not a certified
          diagnostic device. Results should be discussed with a qualified
          healthcare professional.
        </div>

        <div className="trust-bar">
          <div className="t-item">
            <span className="t-icon">
              <PulseIcon />
            </span>
            <div>
              <h5>Instant results</h5>
              <p>No waiting room</p>
            </div>
          </div>
          <div className="t-item">
            <span className="t-icon">
              <ShieldIcon />
            </span>
            <div>
              <h5>Private data</h5>
              <p>Yours alone</p>
            </div>
          </div>
          <div className="t-item">
            <span className="t-icon">
              <LayersIcon />
            </span>
            <div>
              <h5>5 conditions</h5>
              <p>One account</p>
            </div>
          </div>
          <div className="t-item">
            <span className="t-icon">
              <BadgeCheckIcon />
            </span>
            <div>
              <h5>Free to use</h5>
              <p>Always</p>
            </div>
          </div>
        </div>

        {/* ---- screen for a condition (category grid) ---- */}
        <section className="landing-section">
          <div className="section-head">
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
          </div>
          <div className="category-grid">
            {Object.entries(DISEASE_META).map(([key, meta]) => (
              <Link
                key={key}
                to={user ? `/predict/${key}` : "/register"}
                className="category-tile"
              >
                <span
                  className="c-icon"
                  style={{ background: `${meta.color}1a`, color: meta.color }}
                >
                  <DiseaseIcon disease={key} />
                </span>
                <span className="label">{meta.label}</span>
              </Link>
            ))}
            <Link to={user ? "/history" : "/login"} className="category-tile">
              <span
                className="c-icon"
                style={{
                  background: "var(--brand-wash)",
                  color: "var(--brand-dark)",
                }}
              >
                <ClipboardIcon />
              </span>
              <span className="label">History</span>
            </Link>
            <Link to="/education" className="category-tile">
              <span
                className="c-icon"
                style={{
                  background: "var(--accent-wash)",
                  color: "var(--accent)",
                }}
              >
                <BookOpenIcon />
              </span>
              <span className="label">Learn</span>
            </Link>
          </div>
        </section>

        {/* ---- learn (education preview, one row) ---- */}
        <section className="landing-section">
          <div className="section-head">
            <div>
              <p className="eyebrow">Education</p>
              <h2>Learn about each condition</h2>
            </div>
            <Link to="/education" style={{ fontSize: 13, fontWeight: 600 }}>
              View all →
            </Link>
          </div>
          <div className="learn-row">
            {Object.entries(DISEASE_META).map(([key, meta]) => {
              const info = diseaseInfo?.[key];
              return (
                <Link key={key} to="/education" className="learn-card">
                  <span
                    className="icon-badge"
                    style={{ background: `${meta.color}1a`, color: meta.color }}
                  >
                    <DiseaseIcon disease={key} />
                  </span>
                  <h4>{meta.label}</h4>
                  <p>{info ? truncate(info.overview, 84) : "Loading…"}</p>
                  <span className="learn-more">
                    Read more <ArrowRightIcon />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ---- disease showcase (product-card style) ---- */}
        <section className="landing-section">
          <div className="section-head">
            <div>
              <p className="eyebrow">Coverage</p>
              <h2>Five screenings, one account</h2>
            </div>
            <p>Metrics measured on a held-out test split, per model.</p>
          </div>
          <div className="disease-grid">
            {Object.entries(DISEASE_META).map(([key, meta]) => (
              <ScreeningCard
                key={key}
                diseaseKey={key}
                meta={meta}
                metrics={schema?.[key]?.metrics}
                to={user ? `/predict/${key}` : "/register"}
              />
            ))}
          </div>
        </section>

        {/* ---- promo banner ---- */}
        <div className="promo-banner">
          <div>
            <span className="p-icon">
              <UploadIcon />
            </span>
            <h2>Already have a lab report?</h2>
            <p>
              Upload a CSV export and we'll auto-fill the panel and run the
              screening for you.
            </p>
            <Link
              to={user ? "/dashboard" : "/register"}
              className="btn btn-primary"
            >
              {user ? "Upload a report" : "Create an account"}
            </Link>
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
        </div>

        <div className="trust-bar" style={{ marginTop: 20 }}>
          <div className="t-item">
            <span className="t-icon">
              <BadgeCheckIcon />
            </span>
            <div>
              <h5>Educational use</h5>
              <p>Not a diagnosis</p>
            </div>
          </div>
          <div className="t-item">
            <span className="t-icon">
              <DatabaseIcon />
            </span>
            <div>
              <h5>Public datasets</h5>
              <p>UCI &amp; Kaggle</p>
            </div>
          </div>
          <div className="t-item">
            <span className="t-icon">
              <ShieldIcon />
            </span>
            <div>
              <h5>No data resale</h5>
              <p>Ever</p>
            </div>
          </div>
          <div className="t-item">
            <span className="t-icon">
              <PulseIcon />
            </span>
            <div>
              <h5>Open source spirit</h5>
              <p>Built as a student FYP</p>
            </div>
          </div>
        </div>

        {/* ---- how it works ---- */}
        <section className="landing-section" id="how-it-works">
          <div className="section-head">
            <div>
              <p className="eyebrow">Process</p>
              <h2>How a screening works</h2>
            </div>
          </div>
          <div className="steps-grid">
            {STEPS.map((s, i) => (
              <div className="card card-pad step-card" key={s.title}>
                <span className="step-icon">
                  <s.icon />
                </span>
                <span className="step-num">{i + 1}</span>
                <h4>{s.title}</h4>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ---- model performance transparency table ---- */}
        <section className="landing-section">
          <div className="section-head">
            <div>
              <p className="eyebrow">Transparency</p>
              <h2>Model performance, in full</h2>
            </div>
          </div>
          <div className="card" style={{ overflowX: "auto" }}>
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
          </div>
          {/* <p className="perf-note">
          Shown as measured, not curated — heart, diabetes and liver currently sit below the 85%
          accuracy target and are still being tuned. Kidney and breast cancer are trained on small,
          well-separated public datasets, so treat their near-perfect scores as a demonstration
          result rather than a validated real-world capability.
        </p> */}
        </section>

        {/* ---- bottom action cards ---- */}
        <div className="bottom-cards">
          <Link to="/education" className="bottom-card light">
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
          </Link>
          <Link to={user ? "/history" : "/login"} className="bottom-card light">
            <span className="bc-icon">
              <ClipboardIcon />
            </span>
            <h4>Track your history</h4>
            <p>Every screening you run is saved to your account, privately.</p>
            <span className="bc-cta">
              View history <ArrowRightIcon />
            </span>
          </Link>
          <Link
            to={user ? "/feedback" : "/register"}
            className="bottom-card dark"
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
          </Link>
        </div>

        {/* ---- real-facts stat strip ---- */}
        <div className="stats-strip">
          <div className="s-item">
            <span className="s-icon">
              <LayersIcon />
            </span>
            <div className="s-num">5</div>
            <div className="s-label">Diseases screened</div>
          </div>
          <div className="s-item">
            <span className="s-icon">
              <DatabaseIcon />
            </span>
            <div className="s-num">300–770</div>
            <div className="s-label">Rows per training dataset</div>
          </div>
          <div className="s-item">
            <span className="s-icon">
              <BadgeCheckIcon />
            </span>
            <div className="s-num">
              {bestAccuracy ? `${(bestAccuracy * 100).toFixed(1)}%` : "—"}
            </div>
            <div className="s-label">Best model accuracy</div>
          </div>
          <div className="s-item">
            <span className="s-icon">
              <ShieldIcon />
            </span>
            <div className="s-num">100%</div>
            <div className="s-label">Free &amp; educational</div>
          </div>
        </div>

        {/* ---- faq ---- */}
        <section className="landing-section">
          <div className="section-head">
            <div>
              <p className="eyebrow">Questions</p>
              <h2>Frequently asked</h2>
            </div>
          </div>
          <div className="faq-list">
            {FAQS.map((f) => (
              <details className="faq-item" key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ---- closing cta ---- */}
        <div className="cta-band">
          <h2>
            {user
              ? "Ready for your next screening?"
              : "Create an account and run your first screening"}
          </h2>
          <p>Free, educational, and takes under a minute to get a result.</p>
          <div className="hero-actions" style={{ justifyContent: "center" }}>
            <Link
              to={user ? "/dashboard" : "/register"}
              className="btn btn-primary"
            >
              {user ? "Go to screening" : "Get started"}
            </Link>
            {!user && (
              <Link to="/login" className="btn btn-ghost">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
