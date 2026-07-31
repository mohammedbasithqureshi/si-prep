export interface Question {
  id: string;
  text: string;
  options: string[];
  answer: number;
  topic: string;
  source: "Old Paper" | "Predicted" | "Admin Created";
}

export interface Topic {
  name: string;
  weight: number;
}

export interface Subject {
  id: string;
  name: string;
  short: string;
  accent: "sky" | "yellow" | "pink";
  duration: number;
  topics: Topic[];
  questions: Question[];
}

export interface AdminTest {
  id: string;
  title: string;
  duration: number;
  questions: Question[];
}

export interface Flashcard {
  id: string;
  type: "concept" | "current-affairs";
  subject: string;
  accent: "sky" | "yellow" | "pink";
  front: string;
  back: string;
  date?: string;
  starred: boolean;
}

export interface TestResult {
  correct: number;
  wrong: number;
  skipped: number;
  total: number;
  marks: number;
  perTopic: Record<string, { correct: number; total: number }>;
}

export interface CurrentAffairsItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
}