import { getAttempts } from "./storage";
import { SUBJECTS as SubjectsData, SUBJECTS } from "../data/subjects";
import { Question } from "../types";

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface FocusTopic {
  subject: string;
  subjectId: string;
  topic: string;
  weight: number;
  accuracy: number; // 0-100, or -1 if never attempted
  priority: number; // higher = more urgent to study
  attempts: number;
}

export type RunnerQuestion = Question & {
  subject: string;
  accent: "sky" | "yellow" | "pink";
};

export interface WeakestTopicResult {
  topic: string;
  subject: string;
  questions: RunnerQuestion[];
}

// ==========================================
// FOCUS TOPICS CALCULATOR
// ==========================================

/**
 * Calculates the highest-priority topics to study based on weight and past test accuracy.
 *
 * @param limit Number of top priority topics to return (default: 5)
 * @returns Array of FocusTopic objects sorted by priority descending
 */
export function getFocusTopics(limit = 5): FocusTopic[] {
  const attempts = getAttempts();

  // Aggregate correct/total answer statistics per topic name across all attempts
  const topicStats: Record<string, { correct: number; total: number }> = {};
  
  attempts.forEach((a) => {
    if (!a.perTopic) return;
    Object.entries(a.perTopic).forEach(([topic, stat]) => {
      // Type assertion resolves the [string, unknown] entry typing
      const { correct, total } = stat as { correct: number; total: number };
      
      if (!topicStats[topic]) {
        topicStats[topic] = { correct: 0, total: 0 };
      }
      topicStats[topic].correct += correct;
      topicStats[topic].total += total;
    });
  });

  const results: FocusTopic[] = [];

  // Calculate priority score for every topic across all subjects
  SUBJECTS.forEach((sub) => {
    sub.topics.forEach((t) => {
      const stat = topicStats[t.name];
      const accuracy = stat && stat.total > 0 ? (stat.correct / stat.total) * 100 : -1;

      // Never-attempted topics get treated as 50% (unknown risk) so they still surface,
      // but don't outrank a topic you're genuinely failing at (<50%).
      const effectiveAccuracy = accuracy === -1 ? 50 : accuracy;

      // Priority formula: High weight + low accuracy = higher priority score
      const priority = t.weight * (100 - effectiveAccuracy);

      results.push({
        subject: sub.short,
        subjectId: sub.id,
        topic: t.name,
        weight: t.weight,
        accuracy,
        priority,
        attempts: stat?.total || 0,
      });
    });
  });

  // Sort by highest priority first and return top N
  return results.sort((a, b) => b.priority - a.priority).slice(0, limit);
}

// ==========================================
// WEAKEST TOPIC QUESTION RETRIEVER
// ==========================================

/**
 * Retrieves practice questions for the single lowest-performing/highest-priority topic.
 *
 * @param count Desired number of questions (default: 5)
 * @returns Object containing topic name, subject name, and question array, or null if no topics found
 */
export function getWeakestTopicQuestions(count = 5): WeakestTopicResult | null {
  // Get the #1 focus topic
  const focus = getFocusTopics(1);
  if (focus.length === 0) return null;
  const weakest = focus[0];

  // Find the matching subject data
  const subject = SubjectsData.find((s) => s.id === weakest.subjectId);
  if (!subject) return null;

  // Filter questions belonging specifically to the weakest topic
  const topicQuestions: RunnerQuestion[] = subject.questions
    .filter((q) => q.topic === weakest.topic)
    .map((q) => ({ ...q, subject: subject.short, accent: subject.accent }));

  // Fallback check: If there aren't enough specific topic questions available,
  // pull from the broader subject pool to avoid returning an empty set.
  const pool: RunnerQuestion[] =
    topicQuestions.length >= count
      ? topicQuestions
      : subject.questions.map((q) => ({ ...q, subject: subject.short, accent: subject.accent }));

  return {
    topic: weakest.topic,
    subject: subject.short,
    questions: pool.slice(0, count),
  };
}