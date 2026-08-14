import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { LayersIcon, PulseIcon, ShieldIcon, SparkleIcon } from "./Icons";

const PANEL_POINTS = [
  { icon: SparkleIcon, text: "AI models trained on real clinical datasets" },
  { icon: ShieldIcon, text: "Your data stays private, always" },
  { icon: PulseIcon, text: "Results in a few seconds" },
  { icon: LayersIcon, text: "5 diseases screened from one account" },
];

export default function AuthLayout({ children }) {
  return (
    <div className="auth-shell">
      <div className="auth-panel">
        <Link to="/" className="auth-panel-logo">
          <img src={logo} alt="Multi-Disease Detection System" />
        </Link>
        <h2>Smart Detection,<br />Better Awareness.</h2>
        <p>AI-powered screening that helps you catch early warning signs across five major conditions.</p>
        <ul className="auth-panel-points">
          {PANEL_POINTS.map((p) => (
            <li key={p.text}>
              <span><p.icon /></span>
              {p.text}
            </li>
          ))}
        </ul>
      </div>
      <div className="auth-form-side">{children}</div>
    </div>
  );
}
