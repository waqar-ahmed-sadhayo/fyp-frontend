import { useState } from "react";
import { useLocation } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, setUser } = useAuth();
  const location = useLocation();

  const [fullName, setFullName] = useState(user?.full_name || "");
  const [age, setAge] = useState(user?.age ?? "");
  const [gender, setGender] = useState(user?.gender ?? "");
  const [saveMsg, setSaveMsg] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const [verifyToken, setVerifyToken] = useState(location.state?.verificationToken || "");
  const [verifyMsg, setVerifyMsg] = useState("");
  const [verifyBusy, setVerifyBusy] = useState(false);

  const saveProfile = async (e) => {
    e.preventDefault();
    setError("");
    setSaveMsg("");
    setBusy(true);
    try {
      const { user: updated } = await api.updateProfile({
        full_name: fullName,
        age: age === "" ? null : age,
        gender: gender || null,
      });
      setUser(updated);
      setSaveMsg("Profile updated.");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const verifyEmail = async (e) => {
    e.preventDefault();
    setVerifyMsg("");
    setVerifyBusy(true);
    try {
      const { user: updated } = await api.verifyEmail(verifyToken);
      setUser(updated);
      setVerifyMsg("Email verified.");
    } catch (err) {
      setVerifyMsg(err.message);
    } finally {
      setVerifyBusy(false);
    }
  };

  if (!user) return null;

  return (
    <div className="shell-inner" style={{ maxWidth: 640 }}>
      <p className="eyebrow">Account</p>
      <h2>Your profile</h2>

      {location.state?.justRegistered && location.state?.verificationToken && !user.email_verified && (
        <div className="disclaimer">
          Account created. No email service is configured in this environment, so here is your
          verification token instead of an emailed link — it won't be shown again:{" "}
          <span className="mono" style={{ fontWeight: 600 }}>{location.state.verificationToken}</span>.
          Use the form below to verify.
        </div>
      )}

      {error && <div className="error-banner">{error}</div>}

      <div className="card card-pad" style={{ marginBottom: 20 }}>
        <p className="eyebrow" style={{ marginBottom: 14 }}>Details</p>
        <form onSubmit={saveProfile}>
          <div className="form-grid">
            <div className="field">
              <label>Full name</label>
              <input required value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div className="field">
              <label>Email</label>
              <input value={user.email} disabled />
            </div>
            <div className="field">
              <label>Age</label>
              <input type="number" min={1} max={120} value={age} onChange={(e) => setAge(e.target.value)} />
            </div>
            <div className="field">
              <label>Gender</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="">Prefer not to say</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          {saveMsg && <p style={{ color: "var(--risk-low)", fontSize: 13, marginTop: 4 }}>{saveMsg}</p>}
          <button className="btn btn-primary" disabled={busy} style={{ marginTop: 12 }}>
            {busy ? "Saving…" : "Save changes"}
          </button>
        </form>
      </div>

      <div className="card card-pad">
        <p className="eyebrow" style={{ marginBottom: 14 }}>Email verification</p>
        {user.email_verified ? (
          <p style={{ fontSize: 13.5, color: "var(--risk-low)", fontWeight: 600 }}>Your email is verified.</p>
        ) : (
          <form onSubmit={verifyEmail}>
            <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 0 }}>
              Paste your verification token below. No email service is configured, so this token
              was shown once, right after registration.
            </p>
            <div className="field">
              <label>Verification token</label>
              <input required value={verifyToken} onChange={(e) => setVerifyToken(e.target.value)} />
            </div>
            {verifyMsg && (
              <p style={{ fontSize: 13, color: verifyMsg === "Email verified." ? "var(--risk-low)" : "var(--risk-high)" }}>
                {verifyMsg}
              </p>
            )}
            <button className="btn btn-ghost" disabled={verifyBusy}>
              {verifyBusy ? "Verifying…" : "Verify email"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
