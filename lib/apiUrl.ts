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

  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "https://nexografix.com";
  const normalizedBase = base.replace(/\/+$/, "");

  let resolved = url.trim();

  // Already a full URL with /api/uploads/ — keep it as-is (nginx proxies /api/ to backend)
  if (resolved.includes("/api/uploads/")) {
    return resolved;
  }

  // Full URL with /uploads/ but missing /api/ prefix — add it so nginx can proxy
  const productionPrefix = "https://nexografix.com/uploads/";
  if (resolved.startsWith(productionPrefix)) {
    return resolved.replace(productionPrefix, `${normalizedBase}/api/uploads/`);
  }

  // Relative path starting with /uploads/ — prefix with base + /api
  if (resolved.startsWith("/uploads/")) {
    return `${normalizedBase}/api${resolved}`;
  }

  // Relative path starting with uploads/ (no leading slash)
  if (resolved.startsWith("uploads/")) {
    return `${normalizedBase}/api/${resolved}`;
  }

  return resolved;
}

