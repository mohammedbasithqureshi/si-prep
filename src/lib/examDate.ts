// TSLPRB has NOT yet announced the actual Preliminary Written Test date
// as of this writing (only the notification + application window are
// confirmed). Sources report conflicting application windows too
// (roughly Aug 10–Sep 9, 2026) — check https://www.tslprb.in directly.
// Set this to null until a real exam date is confirmed.
export const EXAM_DATE: Date | null = null;

export function getDaysUntilExam(): number | null {
  if (!EXAM_DATE) return null;
  const now = new Date();
  const diff = EXAM_DATE.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}