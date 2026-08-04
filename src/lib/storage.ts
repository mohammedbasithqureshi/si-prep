import { NoteEntry } from "../data/notes";

const KEYS = {
  streak: "siprep_streak",
  bookmarks: "siprep_bookmarks",
  attempts: "siprep_attempts",
  flashcards: "siprep_flashcards",
  adminTests: "siprep_admin_tests",
  notes: "siprep_custom_notes",
};

// --- Storage Utilities ---

function get<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.error(`[storage] FAILED to read "${key}":`, e);
    return fallback;
  }
}

function set<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    console.log(`[storage] Saved "${key}" —`, value);
    return true;
  } catch (e) {
    console.error(`[storage] FAILED to save "${key}":`, e);
    return false;
  }
}

// --- Custom Notes ---

export function getCustomNotes(): NoteEntry[] {
  return get(KEYS.notes, []);
}

export function addCustomNote(note: NoteEntry) {
  const notes = getCustomNotes();
  const next = [...notes, note];
  set(KEYS.notes, next);
  return next;
}

export function deleteCustomNote(id: string) {
  const next = getCustomNotes().filter((n) => n.id !== id);
  set(KEYS.notes, next);
  return next;
}

// --- Streak ---

export interface StreakData {
  count: number;
  lastActive: string | null; // ISO date
  last7: boolean[];
}

export function getStreak(): StreakData {
  return get(KEYS.streak, {
    count: 0,
    lastActive: null,
    last7: [false, false, false, false, false, false, false],
  });
}

export function bumpStreak() {
  const today = new Date().toISOString().slice(0, 10);
  const s = getStreak();
  if (s.lastActive === today) return s;

  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const newCount = s.lastActive === yesterday ? s.count + 1 : 1;
  const last7 = [...s.last7.slice(1), true];
  const updated = { count: newCount, lastActive: today, last7 };

  set(KEYS.streak, updated);
  return updated;
}

// --- Bookmarks ---

export interface BookmarkItem {
  id: string;
  type: "question" | "flashcard";
  text: string;
  subject: string;
  topic?: string;
  options?: string[];
  answer?: number;
  back?: string;
  savedAt: string;
}

export function getBookmarks(): BookmarkItem[] {
  return get(KEYS.bookmarks, []);
}

export function addBookmark(item: Omit<BookmarkItem, "savedAt">) {
  const b = getBookmarks();
  if (b.find((x) => x.id === item.id)) return b;
  const next = [{ ...item, savedAt: new Date().toISOString() }, ...b];
  set(KEYS.bookmarks, next);
  return next;
}

export function removeBookmark(id: string) {
  const b = getBookmarks().filter((x) => x.id !== id);
  set(KEYS.bookmarks, b);
  return b;
}

export function isBookmarked(id: string): boolean {
  return getBookmarks().some((x) => x.id === id);
}

// --- Attempts ---

export function getAttempts(): any[] {
  return get(KEYS.attempts, []);
}

export function saveAttempt(attempt: any) {
  const a = getAttempts();
  set(KEYS.attempts, [attempt, ...a].slice(0, 100));
}

// --- Flashcards ---

export function getFlashcardState(): Record<string, boolean> {
  return get(KEYS.flashcards, {});
}

export function toggleFlashcardStar(id: string) {
  const s = getFlashcardState();
  s[id] = !s[id];
  set(KEYS.flashcards, s);
  return s;
}

// --- Admin Tests ---

export function getAdminTestsLocal(): any[] {
  return get(KEYS.adminTests, []);
}

export function saveAdminTestsLocal(tests: any[]): boolean {
  return set(KEYS.adminTests, tests);
}