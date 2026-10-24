const TOKEN_KEY = "nk_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

let onUnauthorized = null;
export const setUnauthorizedHandler = (fn) => {
  onUnauthorized = fn;
};

function buildUrl(path, query) {
  const params = new URLSearchParams();
  Object.entries(query || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") params.set(k, v);
  });
  const qs = params.toString();
  return `${API_BASEURL}${path}${qs ? `?${qs}` : ""}`;
}

/**
 * Wrapper fetch ke backend NebengKampus.
 * Mengembalikan field `data` dari respons { success, message, data }.
 */
export async function api(path, { method = "GET", body, query, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(buildUrl(path, query), {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError("Tidak dapat terhubung ke server", 0);
  }

  const json = await res.json().catch(() => null);
  if (!res.ok || json?.success === false) {
    if (res.status === 401 && auth && token) {
      clearToken();
      if (onUnauthorized) onUnauthorized();
    }
    throw new ApiError(json?.message || `Permintaan gagal (${res.status})`, res.status);
  }
  return json?.data ?? null;
}
