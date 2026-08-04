import { Question } from "../types";

// Expected format, one question per block, separated by a blank line:
//
// Q: What is the capital of Telangana?
// A) Warangal
// B) Hyderabad
// C) Karimnagar
// D) Nizamabad
// Correct: B
// Topic: Geography of India
//
// Q: ...

function uid() {
  return `bulk-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

export interface ParseResult {
  questions: Question[];
  errors: string[];
}

export function parseBulkText(raw: string): ParseResult {
  const blocks = raw.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  const questions: Question[] = [];
  const errors: string[] = [];

  blocks.forEach((block, blockIndex) => {
    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
    const qLine = lines.find((l) => /^Q[:\.]/i.test(l));
    const optionLines = lines.filter((l) => /^[A-D][\):\.]/i.test(l));
    const correctLine = lines.find((l) => /^Correct[:\.]/i.test(l));
    const topicLine = lines.find((l) => /^Topic[:\.]/i.test(l));

    if (!qLine || optionLines.length < 2 || !correctLine) {
      errors.push(`Block ${blockIndex + 1}: missing question, options, or correct answer — skipped.`);
      return;
    }

    const text = qLine.replace(/^Q[:\.]\s*/i, "");
    const options = optionLines.map((l) => l.replace(/^[A-D][\):\.]\s*/i, ""));
    const correctLetter = correctLine.replace(/^Correct[:\.]\s*/i, "").trim().toUpperCase();
    const answer = correctLetter.charCodeAt(0) - 65; // A=0, B=1, etc.

    if (answer < 0 || answer >= options.length) {
      errors.push(`Block ${blockIndex + 1}: "Correct: ${correctLetter}" doesn't match any option — skipped.`);
      return;
    }

    const topic = topicLine ? topicLine.replace(/^Topic[:\.]\s*/i, "") : "General";

    questions.push({
      id: uid(),
      text,
      options,
      answer,
      topic,
      source: "Admin Created",
    });
  });

  return { questions, errors };
}