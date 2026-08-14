import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import AuthLayout from "../components/AuthLayout";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [devToken, setDevToken] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setDevToken("");
    setBusy(true);
    try {
      const res = await api.forgotPassword(email);
      setMessage(res.message);
      if (res.reset_token) setDevToken(res.reset_token);
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
        <h2>Forgot password</h2>
        {error && <div className="error-banner">{error}</div>}
        {message && !devToken && <p style={{ fontSize: 13.5, color: "var(--muted)" }}>{message}</p>}

        {devToken ? (
          <div>
            <div className="disclaimer">
              No email service is configured — here is your reset token instead of an emailed
              link (expires in 1 hour): <span className="mono" style={{ fontWeight: 600 }}>{devToken}</span>
            </div>
            <button
              className="btn btn-primary btn-block"
              onClick={() => navigate("/reset-password", { state: { token: devToken } })}
            >
              Continue to reset password
            </button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div className="field">
              <label>Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com" />
            </div>
            <button className="btn btn-primary btn-block" disabled={busy}>
              {busy ? "Requesting…" : "Send reset token"}
            </button>
          </form>
        )}

        <p className="auth-foot">
          Remembered it? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </AuthLayout>
  );
}
