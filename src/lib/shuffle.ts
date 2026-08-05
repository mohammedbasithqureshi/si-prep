import { Question } from "../types";

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Shuffles question order AND each question's option order, correctly
// remapping the `answer` index so scoring still works after reshuffling.
export function randomizeQuestions<T extends Question>(questions: T[]): T[] {
  const reordered = shuffleArray(questions);
  return reordered.map((q) => {
    const optionIndices = q.options.map((_, i) => i);
    const shuffledIndices = shuffleArray(optionIndices);
    const newOptions = shuffledIndices.map((i) => q.options[i]);
    const newAnswer = shuffledIndices.indexOf(q.answer);
    return { ...q, options: newOptions, answer: newAnswer };
  });
}