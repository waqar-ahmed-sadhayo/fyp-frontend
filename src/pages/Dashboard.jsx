import { useEffect, useState } from "react";
import { api } from "../api/client";
import { DISEASE_META } from "../diseaseConfig";
import ScreeningCard from "../components/ScreeningCard";
import Reveal, { StaggerGroup } from "../components/Reveal";
import { useAuth } from "../context/AuthContext";

const KIDNEY_STONE_META = {
  label: "Kidney Stone (CT Scan)",
  tagline: "Stone detection from a CT scan image or PDF report",
  color: "var(--disease-kidney)",
};

export default function Dashboard() {
  const { user } = useAuth();
  const [schema, setSchema] = useState(null);
  const [stoneMetrics, setStoneMetrics] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.diseases().then(setSchema).catch((e) => setError(e.message));
    api.kidneyStoneInfo().then((d) => setStoneMetrics(d.metrics)).catch(() => {});
  }, []);

  return (
    <div className="shell-inner">
      <Reveal as="div" className="section-head">
        <div>
          <p className="eyebrow">Workspace overview</p>
          <h2>Welcome{user?.full_name ? `, ${user.full_name.split(" ")[0]}` : ""}</h2>
        </div>
      </Reveal>
      <p style={{ color: "var(--muted)", marginTop: 4 }}>
        Pick a screening service from the sidebar to fill in its panel and get
        an instant risk read. Each model is trained and validated on a public
        clinical dataset — metrics shown are measured on a held-out test split.
      </p>

      {error && <div className="error-banner">{error}</div>}

      <div className="mobile-service-grid">
        <StaggerGroup as="div" className="disease-grid">
          {Object.entries(DISEASE_META).map(([key, meta]) => (
            <ScreeningCard
              key={key}
              diseaseKey={key}
              meta={meta}
              metrics={schema?.[key]?.metrics}
              to={`/predict/${key}`}
            />
          ))}
          <ScreeningCard
            diseaseKey="kidney"
            meta={KIDNEY_STONE_META}
            metrics={stoneMetrics}
            to="/screening/kidney-stone"
          />
        </StaggerGroup>
      </div>
    </div>
  );
}
