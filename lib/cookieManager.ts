/**
 * Nexografix Cookie & Preference Governance Manager
 * Compliant with DPDP Act 2023 (India), IT Act 2000, and UK GDPR
 */

export type CookieCategories = {
  necessary: boolean; // Always true
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
};

const STORAGE_KEY = "nexografix_cookie_consent_session";

export function getActiveConsent(): CookieCategories {
  if (typeof window === "undefined") {
    return { necessary: true, functional: false, analytics: false, marketing: false };
  }

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return { necessary: true, functional: false, analytics: false, marketing: false };
    const parsed = JSON.parse(raw);
    return {
      necessary: true,
      functional: Boolean(parsed?.categories?.functional),
      analytics: Boolean(parsed?.categories?.analytics),
      marketing: Boolean(parsed?.categories?.marketing),
    };
  } catch {
    return { necessary: true, functional: false, analytics: false, marketing: false };
  }
}

/**
 * Check if a specific cookie category is permitted by the user
 */
export function isCategoryAllowed(category: keyof CookieCategories): boolean {
  if (category === "necessary") return true;
  const active = getActiveConsent();
  return Boolean(active[category]);
}

/**
 * Helper to set functional cookie preference (UI customizations, draft saving)
 */
export function setFunctionalPreference(key: string, value: string): boolean {
  if (!isCategoryAllowed("functional")) {
    console.info(`[Cookie Governance] Blocked storage for key '${key}': Functional cookies not consented.`);
    return false;
  }
  try {
    sessionStorage.setItem(`pref_${key}`, value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Helper to log analytics event if Analytics category is permitted
 */
export function trackAnalyticsEvent(eventName: string, metadata: Record<string, any> = {}): boolean {
  if (!isCategoryAllowed("analytics")) {
    return false;
  }
  // Log performance/analytics metric
  if (process.env.NODE_ENV === "development") {
    console.log(`[Analytics Tracked] ${eventName}`, metadata);
  }
  return true;
}

/**
 * Helper to display marketing outreach elements if Marketing category is permitted
 */
export function canShowMarketingOutreach(): boolean {
  return isCategoryAllowed("marketing");
}
