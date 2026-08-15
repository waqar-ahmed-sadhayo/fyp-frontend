import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);
const STORAGE_KEY = "mdds_theme";

function systemPrefersDark() {
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
}

export function ThemeProvider({ children }) {
  // The user's saved override ("light"/"dark"), or null if they've never
  // overridden the OS preference — matches the inline script in
  // index.html, which only stamps <html data-theme> when this is set.
  const [explicit, setExplicit] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === "light" || saved === "dark" ? saved : null;
  });
  // What's actually showing right now — tracked separately so the toggle
  // button can show the right icon even in "system" mode. CSS never reads
  // this; it reacts to the data-theme attribute / media query directly.
  const [resolved, setResolved] = useState(() => explicit || (systemPrefersDark() ? "dark" : "light"));

  useEffect(() => {
    if (explicit) {
      document.documentElement.setAttribute("data-theme", explicit);
      setResolved(explicit);
    } else {
      document.documentElement.removeAttribute("data-theme");
      setResolved(systemPrefersDark() ? "dark" : "light");
    }
  }, [explicit]);

  useEffect(() => {
    if (explicit) return; // an explicit choice overrides the OS from here on
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setResolved(mq.matches ? "dark" : "light");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [explicit]);

  const toggleTheme = () => {
    const next = resolved === "dark" ? "light" : "dark";
    localStorage.setItem(STORAGE_KEY, next);
    setExplicit(next);
  };

  return (
    <ThemeContext.Provider value={{ theme: resolved, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
