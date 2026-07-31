import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CUTOFF } from "../data/subjects";
import { CheckCircle2, XCircle, Circle, Trophy, Target, RotateCcw, Award } from "lucide-react";

export default function Results() {
  const { state } = useLocation() as { state: { result: any } };
  const nav = useNavigate();
  if (!state?.result) { nav("/"); return null; }
  const result = state.result;
  const pct = Math.max(0, (result.marks / result.total) * 100);
  const cleared = pct >= CUTOFF.OC;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex flex-col items-center text-center">
        <div className={`mb-3 flex h-16 w-16 items-center justify-center rounded-full ${cleared ? "bg-sky-100 text-sky-600" : "bg-pink-100 text-pink-600"}`}>
          {cleared ? <Trophy size={30} /> : <Target size={30} />}
        </div>
        <h1 className="text-2xl font-bold text-slate-800" style={{ fontFamily: "Sora" }}>{cleared ? "Cutoff Cleared" : "Below Cutoff"}</h1>
        <p className="mt-1 text-sm text-slate-500">Score: <span className="font-bold text-slate-800">{result.marks.toFixed(2)}</span> / {result.total}</p>
      </div>

      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="relative h-4 w-full rounded-full bg-slate-100">
          <div className={`h-full rounded-full ${cleared ? "bg-sky-500" : "bg-pink-500"}`} style={{ width: `${Math.min(100, Math.max(0, pct))}%` }} />
          <div className="absolute top-[-6px]" style={{ left: `${CUTOFF.OC}%` }}><span className="block h-6 w-0.5 bg-yellow-500" /></div>
        </div>
        <p className="mt-2 text-[11px] text-slate-400">Yellow marker at {CUTOFF.OC}% — OC cutoff (BC {CUTOFF.BC}% · SC/ST {CUTOFF.SC_ST}%)</p>
      </div>

      <div className="mb-8 grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm"><CheckCircle2 className="mx-auto mb-1 text-sky-500" size={18} /><p className="text-lg font-bold text-slate-800">{result.correct}</p><p className="text-[11px] text-slate-400">Correct</p></div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm"><XCircle className="mx-auto mb-1 text-pink-500" size={18} /><p className="text-lg font-bold text-slate-800">{result.wrong}</p><p className="text-[11px] text-slate-400">Wrong</p></div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm"><Circle className="mx-auto mb-1 text-slate-400" size={18} /><p className="text-lg font-bold text-slate-800">{result.skipped}</p><p className="text-[11px] text-slate-400">Skipped</p></div>
      </div>

      <div className="flex gap-3">
        <button onClick={() => nav(-1)} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-sky-500 py-3 font-bold text-white"><RotateCcw size={16} /> Retry</button>
        <button onClick={() => nav("/")} className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 font-bold text-slate-600"><Award size={16} /> Back</button>
      </div>
    </div>
  );
}