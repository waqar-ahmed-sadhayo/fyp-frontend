import { Link } from "react-router-dom";
import { ArrowRightIcon, DiseaseIcon } from "./Icons";

// Keys match the snake_case chosen_model values the backend actually returns
// (see backend/app/ml/train_models.py) — not the display names.
const MODEL_SHORT = {
  logistic_regression: "LR",
  random_forest: "RF",
  svm: "SVM",
  gradient_boosting: "GB",
};

export default function ScreeningCard({ diseaseKey, meta, metrics, to }) {
  return (
    <Link to={to} className="disease-card">
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
    </Link>
  );
}
