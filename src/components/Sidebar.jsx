import { NavLink } from "react-router-dom";
import { motion } from "motion/react";
import { DISEASE_META } from "../diseaseConfig";
import { useAuth } from "../context/AuthContext";
import { tapScale } from "../lib/motion";
import { ClipboardIcon, DiseaseIcon, HomeIcon, SendIcon, ShieldIcon } from "./Icons";

const MotionNavLink = motion.create(NavLink);

function initials(name = "") {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase();
}

const linkClass = ({ isActive }) => `sidebar-link${isActive ? " active" : ""}`;

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="app-sidebar">
      <div className="sidebar-scroll">
        <div className="sidebar-section">
          <MotionNavLink to="/dashboard" end className={linkClass} whileTap={tapScale}>
            <span className="sidebar-link-icon home"><HomeIcon /></span>
            <span className="sidebar-link-text">
              <span className="sidebar-link-title">Overview</span>
            </span>
          </MotionNavLink>
        </div>

        <div className="sidebar-section">
          <p className="sidebar-label">Screening services</p>
          <nav className="sidebar-nav">
            {Object.entries(DISEASE_META).map(([key, meta]) => (
              <MotionNavLink key={key} to={`/predict/${key}`} className={linkClass} whileTap={tapScale}>
                <span
                  className="sidebar-link-icon"
                  style={{ background: `color-mix(in srgb, ${meta.color} 12%, transparent)`, color: meta.color }}
                >
                  <DiseaseIcon disease={key} />
                </span>
                <span className="sidebar-link-text">
                  <span className="sidebar-link-title">{meta.label}</span>
                  <span className="sidebar-link-sub">{meta.tagline}</span>
                </span>
              </MotionNavLink>
            ))}
            <MotionNavLink to="/screening/kidney-stone" className={linkClass} whileTap={tapScale}>
              <span
                className="sidebar-link-icon"
                style={{ background: "color-mix(in srgb, var(--disease-kidney) 12%, transparent)", color: "var(--disease-kidney)" }}
              >
                <DiseaseIcon disease="kidney" />
              </span>
              <span className="sidebar-link-text">
                <span className="sidebar-link-title">Kidney Stone (CT Scan)</span>
                <span className="sidebar-link-sub">Upload a CT image or PDF report</span>
              </span>
            </MotionNavLink>
          </nav>
        </div>

        <div className="sidebar-section">
          <p className="sidebar-label">Account</p>
          <nav className="sidebar-nav">
            <MotionNavLink to="/history" className={linkClass} whileTap={tapScale}>
              <span className="sidebar-link-icon"><ClipboardIcon /></span>
              <span className="sidebar-link-text">
                <span className="sidebar-link-title">History</span>
              </span>
            </MotionNavLink>
            <MotionNavLink to="/feedback" className={linkClass} whileTap={tapScale}>
              <span className="sidebar-link-icon"><SendIcon /></span>
              <span className="sidebar-link-text">
                <span className="sidebar-link-title">Feedback</span>
              </span>
            </MotionNavLink>
          </nav>
        </div>

        {user?.is_admin && (
          <div className="sidebar-section">
            <p className="sidebar-label">Admin</p>
            <nav className="sidebar-nav">
              <MotionNavLink to="/admin" className={linkClass} whileTap={tapScale}>
                <span className="sidebar-link-icon"><ShieldIcon /></span>
                <span className="sidebar-link-text">
                  <span className="sidebar-link-title">User accounts</span>
                </span>
              </MotionNavLink>
            </nav>
          </div>
        )}
      </div>

      {user && (
        <MotionNavLink to="/profile" className="sidebar-user" whileTap={tapScale}>
          <span className="avatar">{initials(user.full_name) || "?"}</span>
          <span className="sidebar-user-info">
            <span className="sidebar-user-name">{user.full_name}</span>
            <span className="sidebar-user-email">{user.email}</span>
          </span>
        </MotionNavLink>
      )}
    </aside>
  );
}
