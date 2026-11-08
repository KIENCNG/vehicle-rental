const API_BASE_URL = "http://localhost:8080";

export function apiFetch(path, options = {}) {
  const user = JSON.parse(localStorage.getItem("vr_user") || "null");

  const headers = {
    ...options.headers,
  };

  if (user?.token) {
    headers.Authorization = `Bearer ${user.token}`;
  }

  return fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });
}
