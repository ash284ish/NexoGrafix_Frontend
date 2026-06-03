// src/lib/apiUrl.ts

function normalizeBaseUrl(base: string) {
  return (base || "").trim().replace(/\/+$/, "");
}

function normalizePath(path: string) {
  return (path || "").trim().replace(/^\/+/, "");
}

/**
 * Safely joins API base and path.
 * Keeps double /api if backend expects it.
 */
export function buildApiUrl(base: string, path: string) {
  const b = normalizeBaseUrl(base);
  const p = normalizePath(path);

  if (!b) return `/${p}`;
  if (!p) return b;

  return `${b}/${p}`;
}
