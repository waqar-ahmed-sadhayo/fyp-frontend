import { Link } from "react-router-dom";
import { motion } from "motion/react";
import logo from "../assets/logo.png";
import Reveal, { StaggerGroup } from "./Reveal";
import { fadeUp, slideInLeft } from "../lib/motion";
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
      <Reveal as="div" className="auth-panel" variants={slideInLeft}>
        <Link to="/" className="auth-panel-logo">
          <img src={logo} alt="Multi-Disease Detection System" />
        </Link>
        <h2>Smart Detection,<br />Better Awareness.</h2>
        <p>AI-powered screening that helps you catch early warning signs across five major conditions.</p>
        <StaggerGroup as="ul" className="auth-panel-points" stagger={0.06}>
          {PANEL_POINTS.map((p) => (
            <motion.li key={p.text} variants={fadeUp}>
              <span><p.icon /></span>
              {p.text}
            </motion.li>
          ))}
        </StaggerGroup>
      </Reveal>
      <Reveal as="div" className="auth-form-side" variants={fadeUp}>{children}</Reveal>
    </div>
  );
}
