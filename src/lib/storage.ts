const KEYS = {
  streak: "siprep_streak",
  bookmarks: "siprep_bookmarks",
  attempts: "siprep_attempts",
  flashcards: "siprep_flashcards",
  adminTests: "siprep_admin_tests",
};

function get<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function set<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export interface StreakData {
  count: number;
  lastActive: string | null; // ISO date
  last7: boolean[];
}

export function getStreak(): StreakData {
  return get(KEYS.streak, { count: 0, lastActive: null, last7: [false, false, false, false, false, false, false] });
}

export function bumpStreak() {
  const today = new Date().toISOString().slice(0, 10);
  const s = getStreak();
  if (s.lastActive === today) return s; // already counted today
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const newCount = s.lastActive === yesterday ? s.count + 1 : 1;
  const last7 = [...s.last7.slice(1), true];
  const updated = { count: newCount, lastActive: today, last7 };
  set(KEYS.streak, updated);
  return updated;
}

export function getBookmarks(): string[] {
  return get(KEYS.bookmarks, []);
}
export function toggleBookmark(id: string) {
  const b = getBookmarks();
  const next = b.includes(id) ? b.filter((x) => x !== id) : [...b, id];
  set(KEYS.bookmarks, next);
  return next;
}

export function getAttempts(): any[] {
  return get(KEYS.attempts, []);
}
export function saveAttempt(attempt: any) {
  const a = getAttempts();
  set(KEYS.attempts, [attempt, ...a].slice(0, 100));
}

export function getFlashcardState(): Record<string, boolean> {
  return get(KEYS.flashcards, {});
}
export function toggleFlashcardStar(id: string) {
  const s = getFlashcardState();
  s[id] = !s[id];
  set(KEYS.flashcards, s);
  return s;
}

export function getAdminTestsLocal(): any[] {
  return get(KEYS.adminTests, []);
}
export function saveAdminTestsLocal(tests: any[]) {
  set(KEYS.adminTests, tests);
}