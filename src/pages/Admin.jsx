import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { BadgeCheckIcon, LayersIcon, ShieldIcon, UserIcon } from "../components/Icons";

export default function Admin() {
  const { user } = useAuth();
  const [users, setUsers] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.is_admin) return;
    api.adminUsers().then(setUsers).catch((e) => setError(e.message));
  }, [user]);

  if (!user?.is_admin) {
    return (
      <div className="shell-inner">
        <div className="empty-state card">
          <h3>Admin access required</h3>
          <p>This page is only visible to admin accounts.</p>
        </div>
      </div>
    );
  }

  const totalUsers = users?.length ?? null;
  const totalScreenings = users?.reduce((sum, u) => sum + (u.screening_count || 0), 0) ?? null;
  const totalAdmins = users?.filter((u) => u.is_admin).length ?? null;

  return (
    <div className="shell-inner">
      <div className="section-head">
        <div>
          <p className="eyebrow">Admin</p>
          <h2>User accounts</h2>
        </div>
      </div>
      <p style={{ color: "var(--muted)", marginTop: 4 }}>
        Every account that has registered on this deployment, and how many
        screenings each has run.
      </p>

      {error && <div className="error-banner">{error}</div>}

      <div className="stats-strip">
        <div className="s-item">
          <span className="s-icon"><UserIcon /></span>
          <div className="s-num">{totalUsers ?? "—"}</div>
          <div className="s-label">Registered users</div>
        </div>
        <div className="s-item">
          <span className="s-icon"><LayersIcon /></span>
          <div className="s-num">{totalScreenings ?? "—"}</div>
          <div className="s-label">Screenings run, all users</div>
        </div>
        <div className="s-item">
          <span className="s-icon"><ShieldIcon /></span>
          <div className="s-num">{totalAdmins ?? "—"}</div>
          <div className="s-label">Admin accounts</div>
        </div>
        <div className="s-item">
          <span className="s-icon"><BadgeCheckIcon /></span>
          <div className="s-num">
            {users ? users.filter((u) => u.email_verified).length : "—"}
          </div>
          <div className="s-label">Verified emails</div>
        </div>
      </div>

      {users === null ? null : users.length === 0 ? (
        <div className="empty-state card" style={{ marginTop: 20 }}>
          <h3>No registered users yet</h3>
        </div>
      ) : (
        <div className="card" style={{ marginTop: 32, overflowX: "auto" }}>
          <table className="history-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Joined</th>
                <th>Screenings</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.full_name}</td>
                  <td className="mono" style={{ color: "var(--muted)" }}>{u.email}</td>
                  <td className="mono" style={{ color: "var(--muted)" }}>
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="mono">{u.screening_count}</td>
                  <td>
                    {u.is_admin ? (
                      <span className="pill" style={{ background: "var(--brand-wash)", color: "var(--brand)" }}>
                        Admin
                      </span>
                    ) : (
                      <span className="pill" style={{ background: "var(--surface-muted)", color: "var(--muted)" }}>
                        User
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
