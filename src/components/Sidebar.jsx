import { NavLink } from "react-router-dom";
import { DISEASE_META } from "../diseaseConfig";
import { useAuth } from "../context/AuthContext";
import { ClipboardIcon, DiseaseIcon, HomeIcon, SendIcon, ShieldIcon } from "./Icons";

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
          <NavLink to="/dashboard" end className={linkClass}>
            <span className="sidebar-link-icon home"><HomeIcon /></span>
            <span className="sidebar-link-text">
              <span className="sidebar-link-title">Overview</span>
            </span>
          </NavLink>
        </div>

        <div className="sidebar-section">
          <p className="sidebar-label">Screening services</p>
          <nav className="sidebar-nav">
            {Object.entries(DISEASE_META).map(([key, meta]) => (
              <NavLink key={key} to={`/predict/${key}`} className={linkClass}>
                <span
                  className="sidebar-link-icon"
                  style={{ background: `${meta.color}1a`, color: meta.color }}
                >
                  <DiseaseIcon disease={key} />
                </span>
                <span className="sidebar-link-text">
                  <span className="sidebar-link-title">{meta.label}</span>
                  <span className="sidebar-link-sub">{meta.tagline}</span>
                </span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="sidebar-section">
          <p className="sidebar-label">Account</p>
          <nav className="sidebar-nav">
            <NavLink to="/history" className={linkClass}>
              <span className="sidebar-link-icon"><ClipboardIcon /></span>
              <span className="sidebar-link-text">
                <span className="sidebar-link-title">History</span>
              </span>
            </NavLink>
            <NavLink to="/feedback" className={linkClass}>
              <span className="sidebar-link-icon"><SendIcon /></span>
              <span className="sidebar-link-text">
                <span className="sidebar-link-title">Feedback</span>
              </span>
            </NavLink>
          </nav>
        </div>

        {user?.is_admin && (
          <div className="sidebar-section">
            <p className="sidebar-label">Admin</p>
            <nav className="sidebar-nav">
              <NavLink to="/admin" className={linkClass}>
                <span className="sidebar-link-icon"><ShieldIcon /></span>
                <span className="sidebar-link-text">
                  <span className="sidebar-link-title">User accounts</span>
                </span>
              </NavLink>
            </nav>
          </div>
        )}
      </div>

      {user && (
        <NavLink to="/profile" className="sidebar-user">
          <span className="avatar">{initials(user.full_name) || "?"}</span>
          <span className="sidebar-user-info">
            <span className="sidebar-user-name">{user.full_name}</span>
            <span className="sidebar-user-email">{user.email}</span>
          </span>
        </NavLink>
      )}
    </aside>
  );
}
