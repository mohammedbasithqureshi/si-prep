// TSLPRB hasn't published the exact prelims exam date yet as of this
// notification (only the notification date, 29 Jul 2026, is confirmed).
// Update EXAM_DATE the moment TSLPRB announces it — check
// https://www.tslprb.in for the official notice.
export const EXAM_DATE = new Date("2026-11-15T09:00:00"); // PLACEHOLDER — update when announced

export function getDaysUntilExam(): number {
  const now = new Date();
  const diff = EXAM_DATE.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}