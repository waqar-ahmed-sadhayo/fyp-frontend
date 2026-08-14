import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import RiskGauge from "../components/RiskGauge";

describe("RiskGauge", () => {
  it("renders the percentage value", () => {
    render(<RiskGauge value={0.734} risk={true} />);
    expect(screen.getByText("73.4%")).toBeInTheDocument();
  });

  it("uses the risk-high color when risk is true", () => {
    const { container } = render(<RiskGauge value={0.5} risk={true} />);
    expect(container.querySelector(".gauge-value").style.color).toBe("var(--risk-high)");
  });

  it("uses the risk-low color when risk is false", () => {
    const { container } = render(<RiskGauge value={0.5} risk={false} />);
    expect(container.querySelector(".gauge-value").style.color).toBe("var(--risk-low)");
  });

  it("clamps out-of-range values into 0-100%", () => {
    render(<RiskGauge value={1.5} risk={false} />);
    expect(screen.getByText("100.0%")).toBeInTheDocument();
  });

  it("clamps negative values to 0%", () => {
    render(<RiskGauge value={-0.2} risk={false} />);
    expect(screen.getByText("0.0%")).toBeInTheDocument();
  });

  it("scales the label vertical offset with the size prop", () => {
    // regression guard: this was hardcoded to -64px regardless of size,
    // which broke when RiskGauge was first reused at a non-default size
    // (see phases/frontend — Landing hero device mockup)
    const { container } = render(<RiskGauge value={0.5} size={84} />);
    expect(container.querySelector(".gauge-value").style.marginTop).toBe("-32px");
  });

  it("defaults to a 0% reading when value is omitted", () => {
    render(<RiskGauge />);
    expect(screen.getByText("0.0%")).toBeInTheDocument();
  });
});
