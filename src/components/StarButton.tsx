import React from "react";
import { Star } from "lucide-react";

export default function StarButton({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} aria-label="Save" className={`rounded-full p-1.5 transition-colors ${active ? "text-yellow-500" : "text-slate-300 hover:text-slate-400"}`}>
      <Star size={18} fill={active ? "currentColor" : "none"} />
    </button>
  );
}