import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

vi.mock("../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));
import { useAuth } from "../context/AuthContext";

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/login" element={<div>login page</div>} />
        <Route
          path="/secret"
          element={
            <ProtectedRoute>
              <div>secret content</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

describe("ProtectedRoute", () => {
  it("renders nothing while auth is still loading", () => {
    useAuth.mockReturnValue({ user: null, loading: true });
    const { container } = renderAt("/secret");
    expect(container).toBeEmptyDOMElement();
  });

  it("redirects to /login when there is no user", () => {
    useAuth.mockReturnValue({ user: null, loading: false });
    renderAt("/secret");
    expect(screen.getByText("login page")).toBeInTheDocument();
  });

  it("renders the protected children when authenticated", () => {
    useAuth.mockReturnValue({ user: { id: "1" }, loading: false });
    renderAt("/secret");
    expect(screen.getByText("secret content")).toBeInTheDocument();
  });
});
