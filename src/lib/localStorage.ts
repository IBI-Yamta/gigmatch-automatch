const KEYS = {
  GEMINI_KEY: "gigmatch_gemini_api_key",
  OPENAI_KEY: "gigmatch_openai_api_key",
  AI_MODE: "gigmatch_ai_mode",
  SHEET_ID: "gigmatch_sheet_id",
  POLL_INTERVAL: "gigmatch_poll_interval",
} as const;

export function getStoredValue<T>(key: string, fallback: T): T {
  try {
    const val = localStorage.getItem(key);
    return val !== null ? (JSON.parse(val) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function setStoredValue<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage full or unavailable
  }
}

export function removeStoredValue(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export { KEYS };