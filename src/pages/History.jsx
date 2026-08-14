import { useEffect, useMemo, useState } from "react";
import {
  CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { api } from "../api/client";
import { DISEASE_META } from "../diseaseConfig";
import {
  AlertTriangleIcon, CheckCircleIcon, DownloadIcon, HelpCircleIcon, TrendingUpIcon,
} from "../components/Icons";

function TrendTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="trend-tooltip">
      <div className="trend-tooltip-date">{label}</div>
      <div className="trend-tooltip-value">{(payload[0].value * 100).toFixed(1)}% confidence</div>
    </div>
  );
}

export default function History() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState("");
  const [exportingId, setExportingId] = useState(null);

  const load = () => {
    api.history().then(setItems).catch((e) => setError(e.message));
  };

  useEffect(load, []);

  const remove = async (id) => {
    try {
      await api.deleteHistory(id);
      setItems((list) => list.filter((r) => r.id !== id));
    } catch (e) {
      setError(e.message);
    }
  };

  const exportPdf = async (r) => {
    setError("");
    setExportingId(r.id);
    try {
      await api.exportHistoryPdf(r.id, r.disease);
    } catch (e) {
      setError(e.message);
    } finally {
      setExportingId(null);
    }
  };

  const trends = useMemo(() => {
    if (!items) return [];
    const byDisease = {};
    for (const r of items) {
      (byDisease[r.disease] ??= []).push(r);
    }
    return Object.entries(byDisease)
      .filter(([, rows]) => rows.length >= 2)
      .map(([disease, rows]) => ({
        disease,
        meta: DISEASE_META[disease],
        data: [...rows]
          .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
          .map((r) => ({
            date: new Date(r.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
            probability: r.probability,
          })),
      }));
  }, [items]);

  return (
    <div className="shell-inner">
      <p className="eyebrow">Your records</p>
      <h2>Test history</h2>

      {error && <div className="error-banner">{error}</div>}

      {trends.length > 0 && (
        <section className="landing-section" style={{ marginTop: 24 }}>
          <div className="section-head">
            <div>
              <p className="eyebrow"><TrendingUpIcon width={13} height={13} style={{ verticalAlign: -2 }} /> Trends</p>
              <h2 style={{ fontSize: 18 }}>Confidence over time</h2>
            </div>
          </div>
          <div className="trend-grid">
            {trends.map(({ disease, meta, data }) => (
              <div className="card card-pad trend-card" key={disease}>
                <p className="trend-card-title">{meta?.label || disease}</p>
                <ResponsiveContainer width="100%" height={140}>
                  <LineChart data={data} margin={{ top: 6, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
                    <YAxis
                      domain={[0, 1]}
                      tickFormatter={(v) => `${Math.round(v * 100)}%`}
                      tick={{ fontSize: 10, fill: "var(--muted)" }}
                      axisLine={false}
                      tickLine={false}
                      width={36}
                    />
                    <Tooltip content={<TrendTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="probability"
                      stroke={meta?.color || "var(--brand)"}
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ))}
          </div>
        </section>
      )}

      {items === null ? null : items.length === 0 ? (
        <div className="empty-state card" style={{ marginTop: 20 }}>
          <h3>No screenings yet</h3>
          <p>Run a screening from the dashboard and it will show up here.</p>
        </div>
      ) : (
        <div className="card" style={{ marginTop: 20, overflowX: "auto" }}>
          <table className="history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Screening</th>
                <th>Result</th>
                <th>Confidence</th>
                <th>Model</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((r) => {
                const isBorderline = r.prediction === "borderline";
                const isRisk = !isBorderline && !["benign", "negative"].includes(r.prediction);
                const pillColor = isBorderline ? "var(--risk-mid)" : isRisk ? "var(--risk-high)" : "var(--risk-low)";
                const pillWash = isBorderline ? "var(--risk-mid-wash)" : isRisk ? "var(--risk-high-wash)" : "var(--risk-low-wash)";
                const PillIcon = isBorderline ? HelpCircleIcon : isRisk ? AlertTriangleIcon : CheckCircleIcon;
                return (
                  <tr key={r.id}>
                    <td className="mono" style={{ color: "var(--muted)" }}>
                      {new Date(r.created_at).toLocaleString()}
                    </td>
                    <td>{DISEASE_META[r.disease]?.label || r.disease}</td>
                    <td>
                      <span className="pill" style={{ background: pillWash, color: pillColor }}>
                        <PillIcon /> {r.prediction}
                      </span>
                    </td>
                    <td className="mono">{(r.probability * 100).toFixed(1)}%</td>
                    <td className="mono" style={{ color: "var(--muted)" }}>{r.model_used}</td>
                    <td style={{ display: "flex", gap: 8 }}>
                      <button
                        className="btn btn-ghost"
                        onClick={() => exportPdf(r)}
                        disabled={exportingId === r.id}
                        title="Export as PDF"
                      >
                        <DownloadIcon width={14} height={14} />
                      </button>
                      <button className="btn btn-danger-ghost" onClick={() => remove(r.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
