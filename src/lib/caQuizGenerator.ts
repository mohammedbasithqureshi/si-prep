import { CurrentAffairsItem } from "../types";
import { Question } from "../types";

// Turns live current-affairs headlines into simple recall questions.
// This can't invent facts (no AI call, by design) — it only reshapes
// the headline itself into a fill-in-the-blank / "what happened" format,
// so questions are only as good as the headline's own clarity.
function uid() {
  return `ca-gen-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

export function buildCurrentAffairsQuiz(items: CurrentAffairsItem[], count = 5): Question[] {
  const usable = items.filter((i) => i.title && i.title.length > 20).slice(0, count);

  return usable.map((item) => {
    const distractorSources = usable.filter((x) => x !== item);
    const decoyTitles = distractorSources.slice(0, 3).map((d) => d.title);
    // Pad with generic decoys if not enough other headlines available
    while (decoyTitles.length < 3) {
      decoyTitles.push("No recent development reported on this topic");
    }
    const options = [item.title, ...decoyTitles];
    // Shuffle
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    return {
      id: uid(),
      text: `Which of the following was reported by ${item.source}?`,
      options,
      answer: options.indexOf(item.title),
      topic: "Current Affairs (National & Int'l)",
      source: "Predicted" as const,
    };
  });
}