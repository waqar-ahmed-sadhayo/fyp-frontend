import { useEffect, useState } from "react";
import { api } from "../api/client";
import { DISEASE_META } from "../diseaseConfig";
import ScreeningCard from "../components/ScreeningCard";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [schema, setSchema] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.diseases().then(setSchema).catch((e) => setError(e.message));
  }, []);

  return (
    <div className="shell-inner">
      <div className="section-head">
        <div>
          <p className="eyebrow">Workspace overview</p>
          <h2>Welcome{user?.full_name ? `, ${user.full_name.split(" ")[0]}` : ""}</h2>
        </div>
      </div>
      <p style={{ color: "var(--muted)", marginTop: 4 }}>
        Pick a screening service from the sidebar to fill in its panel and get
        an instant risk read. Each model is trained and validated on a public
        clinical dataset — metrics shown are measured on a held-out test split.
      </p>

      {error && <div className="error-banner">{error}</div>}

      <div className="mobile-service-grid">
        <div className="disease-grid">
          {Object.entries(DISEASE_META).map(([key, meta]) => (
            <ScreeningCard
              key={key}
              diseaseKey={key}
              meta={meta}
              metrics={schema?.[key]?.metrics}
              to={`/predict/${key}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
