import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRightIcon, DiseaseIcon } from "./Icons";
import { fadeUp, hoverLift, tapScale } from "../lib/motion";

// Keys match the snake_case chosen_model values the backend actually returns
// (see backend/app/ml/train_models.py) — not the display names.
const MODEL_SHORT = {
  logistic_regression: "LR",
  random_forest: "RF",
  svm: "SVM",
  gradient_boosting: "GB",
};

const MotionLink = motion.create(Link);

export default function ScreeningCard({ diseaseKey, meta, metrics, to }) {
  return (
    <MotionLink
      to={to}
      className="disease-card"
      variants={fadeUp}
      whileHover={hoverLift}
      whileTap={tapScale}
    >
      {metrics?.chosen_model && (
        <span className="corner-badge">{MODEL_SHORT[metrics.chosen_model] || metrics.chosen_model}</span>
      )}
      <span className="icon-badge" style={{ background: `color-mix(in srgb, ${meta.color} 12%, transparent)`, color: meta.color }}>
        <DiseaseIcon disease={diseaseKey} />
      </span>
      <h3>{meta.label}</h3>
      <p>{meta.tagline}</p>
      <div className="card-action-row">
        <span className="stat-price">{metrics ? `${(metrics.accuracy * 100).toFixed(1)}% acc` : "Loading…"}</span>
        <span className="go-btn"><ArrowRightIcon /></span>
      </div>
    </MotionLink>
  );
}
