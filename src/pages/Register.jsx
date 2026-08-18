import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/AuthLayout";
import { hoverLift, tapScale } from "../lib/motion";
import { EyeIcon, EyeOffIcon } from "../components/Icons";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await register(fullName, email, password);
      navigate("/profile", { state: { verificationToken: res.verification_token, justRegistered: true } });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout>
      <div className="card card-pad auth-card">
        <p className="eyebrow">Create your account</p>
        <h2>Register</h2>
        {error && <div className="error-banner">{error}</div>}
        <form onSubmit={submit}>
          <div className="field">
            <label>Full name</label>
            <input required value={fullName} onChange={(e) => setFullName(e.target.value)}
              placeholder="Jane Doe" />
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com" />
          </div>
          <div className="field">
            <label>Password <span className="hint">min 8 characters</span></label>
            <div className="password-field-wrap">
              <input type={showPassword ? "text" : "password"} required minLength={8} value={password}
                onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? <EyeOffIcon width={18} height={18} /> : <EyeIcon width={18} height={18} />}
              </button>
            </div>
          </div>
          <motion.button
            className="btn btn-primary btn-block"
            disabled={busy}
            whileHover={busy ? undefined : hoverLift}
            whileTap={busy ? undefined : tapScale}
          >
            {busy ? "Creating account…" : "Create account"}
          </motion.button>
        </form>
        <p className="auth-foot">
          Already registered? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </AuthLayout>
  );
}
