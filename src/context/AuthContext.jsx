import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, clearTokens, setSessionExpiredHandler, setTokens } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setSessionExpiredHandler(() => {
      setUser(null);
      setSessionExpired(true);
      navigate("/login");
    });
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("mdds_token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .me()
      .then(({ user }) => setUser(user))
      .catch(() => clearTokens())
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    setTokens(res.token, res.refresh_token);
    setSessionExpired(false);
    setUser(res.user);
  };

  const register = async (full_name, email, password) => {
    const res = await api.register({ full_name, email, password });
    setTokens(res.token, res.refresh_token);
    setSessionExpired(false);
    setUser(res.user);
    return res; // includes verification_token — no email service, see auth.py
  };

  const logout = () => {
    api.logout(); // best-effort server-side refresh-token revoke, fire-and-forget
    clearTokens();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, sessionExpired, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
