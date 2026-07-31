import { Question } from "../types";

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function shuffleOptions(correct: string, distractors: string[]) {
  const options = [correct, ...distractors];
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return { options, answer: options.indexOf(correct) };
}
function uid() {
  return `gen-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

/* -------- Simple Interest -------- */
function genSimpleInterest(): Question {
  const P = randInt(2, 20) * 1000;
  const R = randInt(4, 12);
  const T = randInt(2, 5);
  const SI = (P * R * T) / 100;
  const correct = `₹${SI.toLocaleString("en-IN")}`;
  const distractors = [
    `₹${(SI + P * 0.01 * T).toLocaleString("en-IN")}`,
    `₹${(SI - R * T * 10).toLocaleString("en-IN")}`,
    `₹${(SI * 1.1).toFixed(0)}`,
  ];
  const { options, answer } = shuffleOptions(correct, distractors);
  return {
    id: uid(),
    text: `Find the simple interest on ₹${P.toLocaleString("en-IN")} at ${R}% per annum for ${T} years.`,
    options, answer,
    topic: "Percentage, Profit & Loss",
    source: "Predicted",
  };
}

/* -------- Number Series (arithmetic / geometric) -------- */
function genNumberSeries(): Question {
  const isArithmetic = Math.random() > 0.5;
  const start = randInt(2, 15);
  let seq: number[] = [];
  let next: number;
  if (isArithmetic) {
    const diff = randInt(2, 8);
    seq = [0, 1, 2, 3].map((i) => start + i * diff);
    next = start + 4 * diff;
  } else {
    const ratio = randInt(2, 3);
    seq = [0, 1, 2, 3].map((i) => start * Math.pow(ratio, i));
    next = start * Math.pow(ratio, 4);
  }
  const distractors = [next + randInt(1, 5), next - randInt(1, 5), next + randInt(6, 12)].map(String);
  const { options, answer } = shuffleOptions(String(next), distractors);
  return {
    id: uid(),
    text: `Find the next number in the series: ${seq.join(", ")}, ?`,
    options, answer,
    topic: "Number Series & Simplification",
    source: "Predicted",
  };
}

/* -------- Time & Work -------- */
function genTimeWork(): Question {
  const a = randInt(10, 25);
  const b = randInt(10, 25);
  const together = (a * b) / (a + b);
  const rounded = Math.round(together * 100) / 100;
  const correct = `${rounded} days`;
  const distractors = [`${Math.round(together) + 1} days`, `${a + b} days`, `${Math.round(together) - 2} days`];
  const { options, answer } = shuffleOptions(correct, distractors);
  return {
    id: uid(),
    text: `A can finish a piece of work in ${a} days and B can finish it in ${b} days. In how many days will they finish it working together?`,
    options, answer,
    topic: "Time, Work & Wages",
    source: "Predicted",
  };
}

/* -------- Averages -------- */
function genAverage(): Question {
  const n = randInt(4, 7);
  const nums = Array.from({ length: n }, () => randInt(10, 60));
  const avg = nums.reduce((a, b) => a + b, 0) / n;
  const correct = avg.toFixed(1);
  const distractors = [(avg + 2).toFixed(1), (avg - 3).toFixed(1), (avg + 5).toFixed(1)];
  const { options, answer } = shuffleOptions(correct, distractors);
  return {
    id: uid(),
    text: `Find the average of: ${nums.join(", ")}`,
    options, answer,
    topic: "Averages & Partnership",
    source: "Predicted",
  };
}

/* -------- Clock angle -------- */
function genClockAngle(): Question {
  const hour = randInt(1, 11);
  const minute = randInt(0, 11) * 5;
  const hourAngle = hour * 30 + minute * 0.5;
  const minuteAngle = minute * 6;
  let diff = Math.abs(hourAngle - minuteAngle);
  if (diff > 180) diff = 360 - diff;
  const correct = `${diff.toFixed(1)}°`;
  const distractors = [`${(diff + 15).toFixed(1)}°`, `${(diff - 10 < 0 ? diff + 20 : diff - 10).toFixed(1)}°`, `${(diff + 30).toFixed(1)}°`];
  const { options, answer } = shuffleOptions(correct, distractors);
  return {
    id: uid(),
    text: `What is the angle between the hour and minute hands at ${hour}:${String(minute).padStart(2, "0")}?`,
    options, answer,
    topic: "Clocks, Calendars & Mensuration",
    source: "Predicted",
  };
}

/* -------- Public API -------- */
// Only these topics can be generated algorithmically — anything fact-based
// (GS, English vocab, Telugu grammar, current affairs) needs real curated
// content instead, since there's no formula to generate a fact from.
const GENERATORS: Record<string, () => Question> = {
  "Percentage, Profit & Loss": genSimpleInterest,
  "Number Series & Simplification": genNumberSeries,
  "Time, Work & Wages": genTimeWork,
  "Averages & Partnership": genAverage,
  "Clocks, Calendars & Mensuration": genClockAngle,
};

export function canGenerate(topic: string): boolean {
  return topic in GENERATORS;
}

export function generatePredictedSet(topics: string[], countPerTopic = 2): Question[] {
  const out: Question[] = [];
  topics.forEach((topic) => {
    const gen = GENERATORS[topic];
    if (!gen) return; // skip topics with no generator — needs curated content
    for (let i = 0; i < countPerTopic; i++) out.push(gen());
  });
  return out;
}