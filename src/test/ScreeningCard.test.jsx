import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ScreeningCard from "../components/ScreeningCard";

const meta = { label: "Heart Disease", tagline: "Cardiovascular risk", color: "#C1443C" };

function renderCard(props = {}) {
  return render(
    <MemoryRouter>
      <ScreeningCard diseaseKey="heart" meta={meta} to="/predict/heart" {...props} />
    </MemoryRouter>
  );
}

describe("ScreeningCard", () => {
  it("shows a loading state without metrics", () => {
    renderCard({ metrics: null });
    expect(screen.getByText("Loading…")).toBeInTheDocument();
  });

  it("shows the disease label and tagline", () => {
    renderCard({ metrics: null });
    expect(screen.getByText("Heart Disease")).toBeInTheDocument();
    expect(screen.getByText("Cardiovascular risk")).toBeInTheDocument();
  });

  it("shows accuracy and the short model badge when metrics are present", () => {
    renderCard({ metrics: { accuracy: 0.82, chosen_model: "logistic_regression" } });
    expect(screen.getByText("82.0% acc")).toBeInTheDocument();
    expect(screen.getByText("LR")).toBeInTheDocument();
  });

  it("maps every known chosen_model to its short badge", () => {
    const cases = [
      ["random_forest", "RF"],
      ["svm", "SVM"],
      ["gradient_boosting", "GB"],
    ];
    for (const [chosen_model, short] of cases) {
      const { unmount } = renderCard({ metrics: { accuracy: 0.9, chosen_model } });
      expect(screen.getByText(short)).toBeInTheDocument();
      unmount();
    }
  });

  it("falls back to the raw model name for an unmapped model", () => {
    renderCard({ metrics: { accuracy: 0.9, chosen_model: "hist_gradient_boosting" } });
    expect(screen.getByText("hist_gradient_boosting")).toBeInTheDocument();
  });

  it("links to the given destination", () => {
    renderCard({ metrics: null });
    expect(screen.getByRole("link")).toHaveAttribute("href", "/predict/heart");
  });
});
