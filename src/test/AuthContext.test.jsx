import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

vi.mock("../api/client", () => ({
  api: {
    me: vi.fn(),
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  },
  setTokens: vi.fn(),
  clearTokens: vi.fn(),
  setSessionExpiredHandler: vi.fn(),
}));

import { api, setTokens, clearTokens, setSessionExpiredHandler } from "../api/client";
import { AuthProvider, useAuth } from "../context/AuthContext";

function TestConsumer() {
  const { user, loading, sessionExpired, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="user">{user ? user.email : "none"}</span>
      <span data-testid="expired">{String(sessionExpired)}</span>
      <button onClick={() => login("a@b.com", "pw")}>do-login</button>
      <button onClick={() => logout()}>do-logout</button>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    </MemoryRouter>
  );
}

describe("AuthContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("finishes loading with no user when there is no stored token", async () => {
    renderWithProvider();
    await waitFor(() => expect(screen.getByTestId("loading")).toHaveTextContent("false"));
    expect(screen.getByTestId("user")).toHaveTextContent("none");
    expect(api.me).not.toHaveBeenCalled();
  });

  it("registers a session-expired handler with the api client on mount", () => {
    renderWithProvider();
    expect(setSessionExpiredHandler).toHaveBeenCalledWith(expect.any(Function));
  });

  it("login stores both the access and refresh tokens, and sets the user", async () => {
    api.login.mockResolvedValue({
      token: "access-1",
      refresh_token: "refresh-1",
      user: { email: "a@b.com" },
    });
    renderWithProvider();
    await waitFor(() => expect(screen.getByTestId("loading")).toHaveTextContent("false"));

    await act(async () => {
      await userEvent.click(screen.getByText("do-login"));
    });

    expect(setTokens).toHaveBeenCalledWith("access-1", "refresh-1");
    expect(screen.getByTestId("user")).toHaveTextContent("a@b.com");
  });

  it("logout revokes server-side, clears local tokens, and clears the user", async () => {
    api.login.mockResolvedValue({
      token: "access-1",
      refresh_token: "refresh-1",
      user: { email: "a@b.com" },
    });
    api.logout.mockResolvedValue();
    renderWithProvider();
    await waitFor(() => expect(screen.getByTestId("loading")).toHaveTextContent("false"));
    await act(async () => {
      await userEvent.click(screen.getByText("do-login"));
    });

    await act(async () => {
      await userEvent.click(screen.getByText("do-logout"));
    });

    expect(api.logout).toHaveBeenCalled();
    expect(clearTokens).toHaveBeenCalled();
    expect(screen.getByTestId("user")).toHaveTextContent("none");
  });

  it("the registered session-expired handler clears the user and flags sessionExpired", async () => {
    renderWithProvider();
    await waitFor(() => expect(screen.getByTestId("loading")).toHaveTextContent("false"));

    const handler = setSessionExpiredHandler.mock.calls[0][0];
    act(() => {
      handler();
    });

    expect(screen.getByTestId("expired")).toHaveTextContent("true");
    expect(screen.getByTestId("user")).toHaveTextContent("none");
  });
});
