import type { ReadingForm } from "./schema";

const KEY = "tarot_reading_request_v1";

export function saveRequest(data: ReadingForm) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function loadRequest(): ReadingForm | null {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ReadingForm;
  } catch {
    return null;
  }
}

export function clearRequest() {
  localStorage.removeItem(KEY);
}
