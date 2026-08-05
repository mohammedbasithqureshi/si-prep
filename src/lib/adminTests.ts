import { Question, AdminTest } from "../types";
import { SUBJECTS } from "../data/subjects";
import { getAdminTestsLocal, saveAdminTestsLocal } from "./storage";

const BATCH_SIZE = 25;

function poolKey(subjectId: string) {
  return `siprep_admin_pool_${subjectId}`;
}

export function getPool(subjectId: string): Question[] {
  try {
    const raw = localStorage.getItem(poolKey(subjectId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setPool(subjectId: string, pool: Question[]) {
  localStorage.setItem(poolKey(subjectId), JSON.stringify(pool));
}

export function getPoolCount(subjectId: string): number {
  return getPool(subjectId).length;
}

// Adds questions to a subject's personal pool. Every time the pool hits
// BATCH_SIZE, it's automatically packaged into a new numbered test
// (e.g. "Reasoning Practice Test 1", then "Test 2" once you add 25 more),
// and the pool resets for the next batch. Returns how many new tests
// this particular add operation triggered, so the UI can confirm it.
export function addQuestionsToPool(subjectId: string, questions: Question[]): number {
  const subject = SUBJECTS.find((s) => s.id === subjectId);
  if (!subject) return 0;

  let pool = [...getPool(subjectId), ...questions];
  const existing: AdminTest[] = getAdminTestsLocal();
  const priorCountForSubject = existing.filter((t) => t.subjectId === subjectId).length;

  let created = 0;
  const additions: AdminTest[] = [];

  while (pool.length >= BATCH_SIZE) {
    const batch = pool.slice(0, BATCH_SIZE);
    pool = pool.slice(BATCH_SIZE);
    created++;
    additions.push({
      id: `admintest-${subjectId}-${Date.now()}-${created}`,
      title: `${subject.short} Practice Test ${priorCountForSubject + created}`,
      subjectId,
      duration: subject.duration,
      questions: batch,
    });
  }

  if (additions.length > 0) {
    saveAdminTestsLocal([...existing, ...additions]);
  }
  setPool(subjectId, pool);
  return created;
}