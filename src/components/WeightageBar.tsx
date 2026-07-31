import React from "react";
import { Topic } from "../types";

const accentMap = {
  sky: "bg-sky-500",
  yellow: "bg-yellow-400",
  pink: "bg-pink-500",
} as const;

export default function WeightageBar({ topics, accent }: { topics: Topic[]; accent: "sky" | "yellow" | "pink" }) {
  return (
    <div className="space-y-1.5">
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
        {topics.map((t, i) => (
          <div key={t.name} title={`${t.name} — ${t.weight}%`} className={`${accentMap[accent]} h-full`} style={{ width: `${t.weight}%`, opacity: 1 - i * 0.1 }} />
        ))}
      </div>
      <p className="text-[11px] text-slate-400">Weightage estimated from previous papers' topic frequency</p>
    </div>
  );
}