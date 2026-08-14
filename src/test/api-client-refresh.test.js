import { describe, it, expect, vi, beforeEach } from "vitest";

// Regression coverage for the actual live bug this was written to fix:
// the backend shortened access tokens to 1h and added a refresh-token
// flow, but the frontend originally kept using only the plain access
// token and silently dropped `refresh_token` — users were getting logged
// out after 1h instead of the old 8h, with no silent refresh happening.

function mockJsonResponse(body, { ok = true, status = 200 } = {}) {
  return { ok, status, json: async () => body };
}

describe("api client — silent refresh on 401", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
    global.fetch = vi.fn();
  });

  it("retries the original request once after a successful silent refresh", async () => {
    localStorage.setItem("mdds_token", "expired-access");
    localStorage.setItem("mdds_refresh_token", "valid-refresh");

    const { api } = await import("../api/client");

    global.fetch
      .mockResolvedValueOnce(mockJsonResponse({ error: "expired" }, { ok: false, status: 401 })) // original call
      .mockResolvedValueOnce(mockJsonResponse({ token: "new-access" })) // POST /auth/refresh
      .mockResolvedValueOnce(mockJsonResponse({ user: { email: "a@b.com" } })); // retried original call

    const result = await api.me();

    expect(result).toEqual({ user: { email: "a@b.com" } });
    expect(global.fetch).toHaveBeenCalledTimes(3);
    expect(localStorage.getItem("mdds_token")).toBe("new-access");

    // the refresh call itself used the refresh token, not the (expired) access token
    const refreshCall = global.fetch.mock.calls[1];
    expect(refreshCall[0]).toContain("/auth/refresh");
    expect(refreshCall[1].headers.Authorization).toBe("Bearer valid-refresh");
  });

  it("clears tokens and throws when the refresh token itself is invalid", async () => {
    localStorage.setItem("mdds_token", "expired-access");
    localStorage.setItem("mdds_refresh_token", "dead-refresh");

    const { api } = await import("../api/client");

    global.fetch
      .mockResolvedValueOnce(mockJsonResponse({ error: "expired" }, { ok: false, status: 401 }))
      .mockResolvedValueOnce(mockJsonResponse({ error: "revoked" }, { ok: false, status: 401 }));

    await expect(api.me()).rejects.toThrow();

    expect(localStorage.getItem("mdds_token")).toBeNull();
    expect(localStorage.getItem("mdds_refresh_token")).toBeNull();
  });

  it("does not attempt a refresh at all when no refresh token is stored", async () => {
    localStorage.setItem("mdds_token", "expired-access");

    const { api } = await import("../api/client");

    global.fetch.mockResolvedValueOnce(mockJsonResponse({ error: "expired" }, { ok: false, status: 401 }));

    await expect(api.me()).rejects.toThrow();
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("calls the session-expired handler when refresh fails", async () => {
    localStorage.setItem("mdds_token", "expired-access");
    localStorage.setItem("mdds_refresh_token", "dead-refresh");

    const { setSessionExpiredHandler } = await import("../api/client");
    const handler = vi.fn();
    setSessionExpiredHandler(handler);

    const { api } = await import("../api/client");
    global.fetch
      .mockResolvedValueOnce(mockJsonResponse({ error: "expired" }, { ok: false, status: 401 }))
      .mockResolvedValueOnce(mockJsonResponse({ error: "revoked" }, { ok: false, status: 401 }));

    await expect(api.me()).rejects.toThrow();
    expect(handler).toHaveBeenCalled();
  });

  it("does not loop forever if the retried request also 401s", async () => {
    localStorage.setItem("mdds_token", "expired-access");
    localStorage.setItem("mdds_refresh_token", "valid-refresh");

    const { api } = await import("../api/client");

    global.fetch
      .mockResolvedValueOnce(mockJsonResponse({ error: "expired" }, { ok: false, status: 401 })) // original
      .mockResolvedValueOnce(mockJsonResponse({ token: "new-access" })) // refresh succeeds
      .mockResolvedValueOnce(mockJsonResponse({ error: "still unauthorized" }, { ok: false, status: 401 })); // retried call still 401s

    await expect(api.me()).rejects.toThrow();
    // exactly 3 calls (original + refresh + one retry) — not an infinite loop
    expect(global.fetch).toHaveBeenCalledTimes(3);
  });
});
