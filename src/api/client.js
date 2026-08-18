const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const TOKEN_KEY = "mdds_token";
const REFRESH_KEY = "mdds_refresh_token";

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY);
}
function setTokens(token, refreshToken) {
  localStorage.setItem(TOKEN_KEY, token);
  if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
}
function clearTokens() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

// Registered by AuthContext so client.js can force a logout/redirect when
// both the access token and the refresh token are no longer valid — without
// client.js needing to know about React Router itself.
let onSessionExpired = null;
function setSessionExpiredHandler(fn) {
  onSessionExpired = fn;
}

// Coalesces concurrent 401s into a single in-flight refresh call instead of
// firing one refresh request per failed request.
let refreshPromise = null;
async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  if (!refreshPromise) {
    refreshPromise = fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { Authorization: `Bearer ${refreshToken}` },
    })
      .then(async (res) => {
        if (!res.ok) return false;
        const data = await res.json();
        setTokens(data.token);
        return true;
      })
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

async function request(path, { method = "GET", body, isForm = false, auth = true, _retried = false } = {}) {
  const headers = {};
  if (!isForm) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: isForm ? body : body ? JSON.stringify(body) : undefined,
  });

  // Access token expired mid-session — try a silent refresh once, then
  // replay the original request, rather than surfacing the 401 to the UI.
  if (res.status === 401 && auth && !_retried && path !== "/auth/refresh") {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return request(path, { method, body, isForm, auth, _retried: true });
    }
    clearTokens();
    onSessionExpired?.();
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    /* no body */
  }

  if (!res.ok) {
    const message = (data && data.error) || `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data;
}

async function downloadFile(path, filename) {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) {
    let message = `Download failed (${res.status})`;
    try {
      const data = await res.json();
      message = data.error || message;
    } catch {
      /* no body */
    }
    throw new Error(message);
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export const api = {
  register: (payload) => request("/auth/register", { method: "POST", body: payload, auth: false }),
  login: (payload) => request("/auth/login", { method: "POST", body: payload, auth: false }),
  me: () => request("/auth/me"),
  verifyEmail: (token) => request("/auth/verify-email", { method: "POST", body: { token } }),
  forgotPassword: (email) => request("/auth/forgot-password", { method: "POST", body: { email }, auth: false }),
  resetPassword: (token, password) =>
    request("/auth/reset-password", { method: "POST", body: { token, password }, auth: false }),
  logout: () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return Promise.resolve();
    // Best-effort server-side revoke — uses the refresh token directly since
    // /auth/logout requires it, not the access token the generic request() sends.
    return fetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${refreshToken}` },
    }).catch(() => {});
  },

  diseases: () => request("/diseases", { auth: false }),
  diseasesInfo: () => request("/diseases/info", { auth: false }),
  predict: (disease, payload) => request(`/predict/${disease}`, { method: "POST", body: payload }),
  predictUpload: (disease, file) => {
    const form = new FormData();
    form.append("file", file);
    return request(`/predict/${disease}/upload`, { method: "POST", body: form, isForm: true });
  },
  predictUploadPdf: (disease, file) => {
    const form = new FormData();
    form.append("file", file);
    return request(`/predict/${disease}/upload-pdf`, { method: "POST", body: form, isForm: true });
  },
  history: (disease) => request(`/history${disease ? `?disease=${disease}` : ""}`),
  deleteHistory: (id) => request(`/history/${id}`, { method: "DELETE" }),
  exportHistoryPdf: (id, disease) => downloadFile(`/history/${id}/export`, `mdds-${disease}-${id.slice(0, 8)}.pdf`),

  getProfile: () => request("/user/profile"),
  updateProfile: (payload) => request("/user/profile", { method: "PUT", body: payload }),

  submitFeedback: (payload) => request("/feedback", { method: "POST", body: payload }),

  adminUsers: () => request("/admin/users"),
  setUserAdmin: (userId, isAdmin) =>
    request(`/admin/users/${userId}/admin`, { method: "PATCH", body: { is_admin: isAdmin } }),
  deleteUser: (userId) => request(`/admin/users/${userId}`, { method: "DELETE" }),

  healthSuggestions: (resultId) =>
    request("/health-suggestions", { method: "POST", body: { result_id: resultId } }),
  assistantChat: (messages) =>
    request("/assistant/chat", { method: "POST", body: { messages } }),

  kidneyStoneInfo: () => request("/xray/kidney-stone/info", { auth: false }),
  predictKidneyStone: (file) => {
    const form = new FormData();
    form.append("file", file);
    return request("/xray/kidney-stone", { method: "POST", body: form, isForm: true });
  },
};

export { getToken, setTokens, clearTokens, setSessionExpiredHandler };
