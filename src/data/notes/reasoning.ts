import { NoteEntry } from "./types";

export const reasoningNotes: NoteEntry[] = [
  {
    id: "n1", subject: "Reasoning", topic: "Percentage, Profit & Loss",
    title: "Simple Interest vs Compound Interest",
    body: "Simple Interest (SI) is calculated only on the principal amount.\nSI = (P × R × T) / 100\n\nCompound Interest (CI) is calculated on principal + accumulated interest.\nCI = P(1 + R/100)^T − P\n\nKey shortcut: For 2 years, CI − SI = P × (R/100)²\n\n- SI grows linearly (straight line)\n- CI grows exponentially (curves upward)\n- CI is always ≥ SI for the same P, R, T (equal only when T=1)",
  },
  {
    id: "n2", subject: "Reasoning", topic: "Time, Work & Wages",
    title: "Work Efficiency Method",
    body: "Instead of fractions, assign total work as LCM of individual days.\n\nExample: A takes 12 days, B takes 18 days.\nLCM(12,18) = 36 units of work.\nA's efficiency = 36/12 = 3 units/day\nB's efficiency = 36/18 = 2 units/day\nTogether = 5 units/day → Time = 36/5 = 7.2 days\n\nThis method avoids fraction arithmetic under time pressure — faster than the (a×b)/(a+b) formula for mental math.",
  },
  {
    id: "n7", subject: "Reasoning", topic: "Number Series & Simplification",
    title: "Common Series Patterns",
    body: "Recognize these patterns quickly:\n\n- Arithmetic: constant difference (2, 5, 8, 11...)\n- Geometric: constant ratio (3, 6, 12, 24...)\n- Squares/Cubes: 1, 4, 9, 16... or 1, 8, 27, 64...\n- Alternating operations: +2, ×2, +2, ×2...\n- Difference of differences (2nd order): 1, 2, 6, 15, 31 → differences are 1,4,9,16 (squares)\n\n- Always check the difference between consecutive terms first\n- If differences aren't constant, check if the differences themselves form a pattern",
  },
];