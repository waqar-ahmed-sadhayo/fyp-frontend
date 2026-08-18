import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import Reveal, { StaggerGroup } from "../components/Reveal";
import { fadeUp, hoverLift, tapScale } from "../lib/motion";
import { ArrowRightIcon, BadgeCheckIcon, LayersIcon, SearchIcon, ShieldIcon, UserIcon } from "../components/Icons";

const PAGE_SIZE_OPTIONS = [5, 10, 15, 20];

// example.com is IANA/RFC-2606-reserved for documentation and testing —
// no real signup ever legitimately uses it, which makes it a reliable
// (not just a today's-cleanup) signal for "this is a test account" rather
// than a name/email substring guess that could hide a real user by accident.
const isTestAccount = (u) => u.email.toLowerCase().endsWith("@example.com");

export default function Admin() {
  const { user } = useAuth();
  const [users, setUsers] = useState(null);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [query, setQuery] = useState("");
  const [hideTestAccounts, setHideTestAccounts] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const load = () => api.adminUsers().then(setUsers).catch((e) => setError(e.message));

  useEffect(() => {
    if (!user?.is_admin) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    setPage(1);
  }, [query, hideTestAccounts, pageSize]);

  const toggleAdmin = async (target) => {
    const makingAdmin = !target.is_admin;
    const verb = makingAdmin ? "Make" : "Remove";
    if (!window.confirm(`${verb} ${target.full_name} (${target.email}) ${makingAdmin ? "an admin" : "as admin"}?`)) return;

    setError("");
    setBusyId(target.id);
    try {
      await api.setUserAdmin(target.id, makingAdmin);
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusyId(null);
    }
  };

  const deleteAccount = async (target) => {
    if (!window.confirm(
      `Permanently delete ${target.full_name} (${target.email})? This removes their account, ` +
      `screening history, and feedback — this can't be undone.`,
    )) return;

    setError("");
    setBusyId(target.id);
    try {
      await api.deleteUser(target.id);
      setUsers((list) => list.filter((u) => u.id !== target.id));
    } catch (e) {
      setError(e.message);
    } finally {
      setBusyId(null);
    }
  };

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

  const q = query.trim().toLowerCase();
  const filteredUsers = users?.filter((u) => {
    if (hideTestAccounts && isTestAccount(u)) return false;
    if (q && !u.full_name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false;
    return true;
  }) ?? null;
  const hiddenCount = users && filteredUsers ? users.length - filteredUsers.length : 0;

  const totalPages = filteredUsers ? Math.max(1, Math.ceil(filteredUsers.length / pageSize)) : 1;
  const currentPage = Math.min(page, totalPages);
  const pagedUsers = filteredUsers?.slice((currentPage - 1) * pageSize, currentPage * pageSize) ?? null;

  const totalUsers = filteredUsers?.length ?? null;
  const totalScreenings = filteredUsers?.reduce((sum, u) => sum + (u.screening_count || 0), 0) ?? null;
  const totalAdmins = filteredUsers?.filter((u) => u.is_admin).length ?? null;

  return (
    <div className="shell-inner">
      <Reveal as="div" className="section-head">
        <div>
          <p className="eyebrow">Admin</p>
          <h2>User accounts</h2>
        </div>
      </Reveal>
      <p style={{ color: "var(--muted)", marginTop: 4 }}>
        Every account that has registered on this deployment, and how many
        screenings each has run.
      </p>

      {error && <div className="error-banner">{error}</div>}

      <StaggerGroup as="div" className="stats-strip">
        <motion.div className="s-item" variants={fadeUp}>
          <span className="s-icon"><UserIcon /></span>
          <div className="s-num">{totalUsers ?? "—"}</div>
          <div className="s-label">Registered users</div>
        </motion.div>
        <motion.div className="s-item" variants={fadeUp}>
          <span className="s-icon"><LayersIcon /></span>
          <div className="s-num">{totalScreenings ?? "—"}</div>
          <div className="s-label">Screenings run, all users</div>
        </motion.div>
        <motion.div className="s-item" variants={fadeUp}>
          <span className="s-icon"><ShieldIcon /></span>
          <div className="s-num">{totalAdmins ?? "—"}</div>
          <div className="s-label">Admin accounts</div>
        </motion.div>
        <motion.div className="s-item" variants={fadeUp}>
          <span className="s-icon"><BadgeCheckIcon /></span>
          <div className="s-num">
            {filteredUsers ? filteredUsers.filter((u) => u.email_verified).length : "—"}
          </div>
          <div className="s-label">Verified emails</div>
        </motion.div>
      </StaggerGroup>

      <div className="admin-filter-row">
        <div className="header-search admin-user-search">
          <SearchIcon className="header-search-icon" />
          <input
            type="text"
            placeholder="Search by name or email…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <label className="admin-filter-toggle">
          <input
            type="checkbox"
            checked={hideTestAccounts}
            onChange={(e) => setHideTestAccounts(e.target.checked)}
          />
          Hide test accounts (@example.com)
        </label>
        {hiddenCount > 0 && (
          <span className="admin-filter-hidden-count">{hiddenCount} hidden</span>
        )}
      </div>

      {filteredUsers === null ? null : filteredUsers.length === 0 ? (
        <Reveal as="div" className="empty-state card" style={{ marginTop: 20 }}>
          <h3>{users.length === 0 ? "No registered users yet" : "No accounts match this filter"}</h3>
        </Reveal>
      ) : (
        <Reveal as="div" className="card" style={{ marginTop: 20, overflowX: "auto" }}>
          <table className="history-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Joined</th>
                <th>Screenings</th>
                <th>Role</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pagedUsers.map((u) => (
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
                  <td style={{ display: "flex", gap: 8 }}>
                    <motion.button
                      type="button"
                      className={u.is_admin ? "btn btn-danger-ghost" : "btn btn-ghost"}
                      style={{ padding: "6px 14px", fontSize: 12.5 }}
                      disabled={busyId === u.id || u.id === user.id}
                      title={u.id === user.id ? "You can't change your own admin status here" : undefined}
                      onClick={() => toggleAdmin(u)}
                      whileHover={busyId === u.id || u.id === user.id ? undefined : hoverLift}
                      whileTap={busyId === u.id || u.id === user.id ? undefined : tapScale}
                    >
                      {busyId === u.id ? "…" : u.is_admin ? "Remove admin" : "Make admin"}
                    </motion.button>
                    <motion.button
                      type="button"
                      className="btn btn-danger-ghost"
                      style={{ padding: "6px 14px", fontSize: 12.5 }}
                      disabled={busyId === u.id || u.id === user.id}
                      title={u.id === user.id ? "You can't delete your own account here" : "Permanently delete this account"}
                      onClick={() => deleteAccount(u)}
                      whileHover={busyId === u.id || u.id === user.id ? undefined : hoverLift}
                      whileTap={busyId === u.id || u.id === user.id ? undefined : tapScale}
                    >
                      Delete
                    </motion.button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="admin-pagination">
            <label className="admin-page-size">
              Rows per page
              <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
                {PAGE_SIZE_OPTIONS.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </label>
            <div className="admin-page-nav">
              <button
                type="button"
                className="btn btn-ghost admin-page-btn"
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                aria-label="Previous page"
              >
                <ArrowRightIcon width={14} height={14} style={{ transform: "rotate(180deg)" }} />
              </button>
              <span className="admin-page-label">Page {currentPage} of {totalPages}</span>
              <button
                type="button"
                className="btn btn-ghost admin-page-btn"
                disabled={currentPage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                aria-label="Next page"
              >
                <ArrowRightIcon width={14} height={14} />
              </button>
            </div>
          </div>
        </Reveal>
      )}
    </div>
  );
}
