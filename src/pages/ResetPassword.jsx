import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { api } from "../api/client";
import AuthLayout from "../components/AuthLayout";
import { hoverLift, tapScale } from "../lib/motion";

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const [token, setToken] = useState(location.state?.token || "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await api.resetPassword(token, password);
      navigate("/login", { state: { resetSuccess: true } });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout>
      <div className="card card-pad auth-card">
        <p className="eyebrow">Reset access</p>
        <h2>Set a new password</h2>
        {error && <div className="error-banner">{error}</div>}
        <form onSubmit={submit}>
          <div className="field">
            <label>Reset token</label>
            <input required value={token} onChange={(e) => setToken(e.target.value)}
              placeholder="paste the token from the previous step" />
          </div>
          <div className="field">
            <label>New password <span className="hint">min 8 characters</span></label>
            <input type="password" required minLength={8} value={password}
              onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <motion.button
            className="btn btn-primary btn-block"
            disabled={busy}
            whileHover={busy ? undefined : hoverLift}
            whileTap={busy ? undefined : tapScale}
          >
            {busy ? "Resetting…" : "Reset password"}
          </motion.button>
        </form>
        <p className="auth-foot">
          <Link to="/login">Back to sign in</Link>
        </p>
      </div>
    </AuthLayout>
  );
}
