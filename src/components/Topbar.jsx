import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { api } from "../api/client";
import { DISEASE_META } from "../diseaseConfig";
import { tapScale } from "../lib/motion";
import {
  ClipboardIcon, CloseIcon, LogOutIcon, MenuIcon, MoonIcon, SearchIcon, SunIcon, UserIcon,
} from "./Icons";
import logo from "../assets/logo.png";

const MotionLink = motion.create(Link);

function initials(name = "") {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase();
}

const navLinkClass = ({ isActive }) => `navbar-link${isActive ? " active" : ""}`;

const SEARCHABLE = [
  ...Object.entries(DISEASE_META).map(([key, meta]) => ({
    type: "disease", key, label: meta.label, sub: meta.tagline,
  })),
  { type: "page", path: "/education", label: "Learn", sub: "Disease education & FAQs" },
  { type: "page", path: "/history", label: "History", sub: "Your past screenings", authOnly: true },
  { type: "page", path: "/feedback", label: "Feedback", sub: "Send us a message", authOnly: true },
];

function HeaderSearch({ user, navigate }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);

  const matches = query.trim()
    ? SEARCHABLE.filter((r) => (!r.authOnly || user) && r.label.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 6)
    : [];

  const select = (r) => {
    setQuery("");
    setOpen(false);
    if (r.type === "disease") navigate(user ? `/predict/${r.key}` : "/register");
    else navigate(r.path);
  };

  return (
    <div
      className="header-search"
      ref={boxRef}
      onBlur={(e) => {
        if (!boxRef.current?.contains(e.relatedTarget)) setOpen(false);
      }}
    >
      <SearchIcon className="header-search-icon" />
      <input
        type="text"
        placeholder="Search a screening or topic…"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => { if (e.key === "Enter" && matches[0]) select(matches[0]); if (e.key === "Escape") setOpen(false); }}
      />
      <AnimatePresence>
        {open && matches.length > 0 && (
          <motion.div
            className="header-search-results"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            {matches.map((r) => (
              <button
                type="button"
                key={`${r.type}-${r.key || r.path}`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => select(r)}
              >
                <span className="r-label">{r.label}</span>
                <span className="r-sub">{r.sub}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Topbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [historyCount, setHistoryCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!user) { setHistoryCount(0); return; }
    api.history().then((list) => setHistoryCount(list.length)).catch(() => {});
  }, [user, location.pathname]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = (
    <>
      <NavLink to="/" end className={navLinkClass}>Home</NavLink>
      {user && <NavLink to="/dashboard" className={navLinkClass}>Screenings</NavLink>}
      <NavLink to="/education" className={navLinkClass}>Learn</NavLink>
      {user && <NavLink to="/feedback" className={navLinkClass}>Feedback</NavLink>}
    </>
  );

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen((v) => !v)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <CloseIcon width={20} height={20} /> : <MenuIcon width={20} height={20} />}
        </button>
        <Link to="/" className="brand-mark">
          <img src={logo} alt="Multi-Disease Detection System" className="brand-logo" />
        </Link>

        <nav className="navbar-links">{navLinks}</nav>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            className="mobile-menu-panel"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            {navLinks}
            {user && <NavLink to="/history" className={navLinkClass}>History</NavLink>}
            {user && <NavLink to="/profile" className={navLinkClass}>Profile</NavLink>}
            {user?.is_admin && <NavLink to="/admin" className={navLinkClass}>Admin</NavLink>}
            {!user && (
              <Link to="/login" className={navLinkClass({ isActive: false })}>Sign in</Link>
            )}
          </motion.nav>
        )}
      </AnimatePresence>

      <HeaderSearch user={user} navigate={navigate} />

      <div className="topbar-actions">
        <motion.button
          type="button"
          className="icon-action"
          title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          onClick={toggleTheme}
          whileTap={tapScale}
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </motion.button>
        {user ? (
          <>
            <MotionLink to="/history" className="icon-action" title="Screening history" whileTap={tapScale}>
              <ClipboardIcon />
              {historyCount > 0 && <span className="badge-count">{historyCount}</span>}
            </MotionLink>
            <MotionLink to="/profile" className="icon-action" title="Your profile" whileTap={tapScale}>
              <span className="avatar">{initials(user.full_name) || "?"}</span>
            </MotionLink>
            <motion.button
              type="button"
              className="icon-action"
              title="Sign out"
              onClick={() => {
                logout();
                navigate("/");
              }}
              whileTap={tapScale}
            >
              <LogOutIcon />
            </motion.button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-link topbar-signin-link">
              Sign in
            </Link>
            <MotionLink to="/register" className="btn btn-primary" whileTap={tapScale}>
              <UserIcon width={15} height={15} /> <span>Register</span>
            </MotionLink>
          </>
        )}
      </div>
    </header>
  );
}
