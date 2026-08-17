import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/AuthLayout";
import { hoverLift, tapScale } from "../lib/motion";

export default function Login() {
  const { login, sessionExpired } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout>
      <div className="card card-pad auth-card">
        <p className="eyebrow">Welcome back</p>
        <h2>Sign in</h2>
        {location.state?.resetSuccess && (
          <p style={{ fontSize: 13, color: "var(--risk-low)", fontWeight: 600, marginTop: -8, marginBottom: 16 }}>
            Password reset — sign in with your new password.
          </p>
        )}
        {sessionExpired && (
          <p style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600, marginTop: -8, marginBottom: 16 }}>
            Your session expired — sign in again to continue.
          </p>
        )}
        {error && <div className="error-banner">{error}</div>}
        <form onSubmit={submit}>
          <div className="field">
            <label>Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com" />
          </div>
          <div className="field">
            <label>
              Password
              <Link to="/forgot-password" style={{ float: "right", fontSize: 12, fontWeight: 500 }}>
                Forgot password?
              </Link>
            </label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" />
          </div>
          <motion.button
            className="btn btn-primary btn-block"
            disabled={busy}
            whileHover={busy ? undefined : hoverLift}
            whileTap={busy ? undefined : tapScale}
          >
            {busy ? "Signing in…" : "Sign in"}
          </motion.button>
        </form>
        <p className="auth-foot">
          No account yet? <Link to="/register">Create one</Link>
        </p>
      </div>
    </AuthLayout>
  );
}
