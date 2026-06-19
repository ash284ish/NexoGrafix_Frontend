// src/lib/apiUrl.ts

function normalizeBaseUrl(base: string) {
  return (base || "").trim().replace(/\/+$/, "");
}

function normalizePath(path: string) {
  return (path || "").trim().replace(/^\/+/, "");
}

export function getApiBaseUrl(): string {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) return "";
  const cleaned = String(base).trim();
  if (
    cleaned === "undefined" ||
    cleaned === "null" ||
    cleaned === "" ||
    cleaned.includes("localhost:8000") ||
    cleaned.includes("127.0.0.1:8000")
  ) {
    return "";
  }
  return cleaned.replace(/\/+$/, "");
}

/**
 * Safely joins API base and path.
 * Keeps double /api if backend expects it.
 */
export function buildApiUrl(base: string, path: string) {
  const b = normalizeBaseUrl(base || getApiBaseUrl());
  const p = normalizePath(path);

  if (!b) return `/${p}`;
  if (!p) return b;

  return `${b}/${p}`;
}

export function resolveImageUrl(url: string | undefined | null): string {
  if (!url) return "";

  const apiBase = getApiBaseUrl();
  const base = apiBase || "https://nexografix.com";
  const normalizedBase = base.replace(/\/+$/, "");

  const resolved = url.trim();

  // Already a full URL with /api/uploads/ — keep it as-is
  if (resolved.includes("/api/uploads/")) {
    return resolved;
  }

  // Full URL with /uploads/ but missing /api/ prefix — add it
  const productionPrefix = "https://nexografix.com/uploads/";
  if (resolved.startsWith(productionPrefix)) {
    return resolved.replace(productionPrefix, `${normalizedBase}/api/uploads/`);
  }

  // Relative path starting with /uploads/
  if (resolved.startsWith("/uploads/")) {
    return `${normalizedBase}/api${resolved}`;
  }

  // Relative path starting with uploads/ (no leading slash)
  if (resolved.startsWith("uploads/")) {
    return `${normalizedBase}/api/${resolved}`;
  }

  return resolved;
}
