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

export function resolveImageUrl(url: string | undefined | null): string {
  if (!url) return "";

  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
  const normalizedBase = base.replace(/\/api\/?$/, ""); // strip /api if present

  // If it starts with production API uploads path, rewrite to local base uploads path
  const productionPrefix = "https://nexografix.com/api/uploads/";
  if (url.startsWith(productionPrefix)) {
    return url.replace(productionPrefix, `${normalizedBase}/uploads/`);
  }

  // If it starts with production base uploads path
  const productionPrefix2 = "https://nexografix.com/uploads/";
  if (url.startsWith(productionPrefix2)) {
    return url.replace(productionPrefix2, `${normalizedBase}/uploads/`);
  }

  // If it's a relative path starting with uploads/ or /uploads/
  if (url.startsWith("uploads/")) {
    return `${normalizedBase}/${url}`;
  }
  if (url.startsWith("/uploads/")) {
    return `${normalizedBase}${url}`;
  }

  return url;
}

