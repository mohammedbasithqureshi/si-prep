import React from "react";
import { useNavigate } from "react-router-dom";
import { SUBJECTS } from "../data/subjects";
import WeightageBar from "./WeightageBar";
import { useApp } from "../context/AppContext";
import { getAdminTestsLocal } from "../lib/storage";
import { Flame, Layers, ArrowRight, BookOpen, ChevronRight, ShieldCheck } from "lucide-react";

export default function Dashboard() {
  const nav = useNavigate();
  const { streak } = useApp();
  const adminTests = getAdminTestsLocal();
  const combinedTopicCount = SUBJECTS.reduce((s, sub) => s + sub.topics.length, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-slate-400">TS Police SI Recruitment 2026</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-800 sm:text-3xl" style={{ fontFamily: "Sora" }}>Mock Test Center</h1>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-yellow-200 bg-yellow-50 px-4 py-3">
          <Flame className="text-yellow-500" size={22} />
          <div>
            <p className="text-lg font-bold leading-none text-slate-800">{streak.count}</p>
            <p className="text-[11px] text-slate-500">day streak</p>
          </div>
          <div className="ml-2 flex gap-1">
            {streak.last7.map((v, i) => <span key={i} className={`h-6 w-1.5 rounded-full ${v ? "bg-yellow-400" : "bg-slate-200"}`} />)}
          </div>
        </div>
      </div>

      <button onClick={() => nav("/test/combined")} className="group mb-8 block w-full rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-50 to-white p-6 text-left transition hover:border-sky-300 sm:p-8">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-600"><Layers size={14} /> Full Length Test</div>
            <h2 className="text-xl font-bold text-slate-800 sm:text-2xl" style={{ fontFamily: "Sora" }}>Combined Prelims Simulation</h2>
            <p className="mt-1 max-w-xl text-sm text-slate-500">All 4 papers, {combinedTopicCount} topics, real exam timing.</p>
          </div>
          <div className="flex items-center gap-2 self-start rounded-xl bg-sky-500 px-5 py-3 font-semibold text-white group-hover:bg-sky-600 sm:self-center">Start Test <ArrowRight size={18} /></div>
        </div>
      </button>

      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">Paper-wise Practice</h3>
      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SUBJECTS.map((sub) => (
          <button key={sub.id} onClick={() => nav(`/test/${sub.id}`)} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:shadow-md">
            <div className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600"><BookOpen size={12} /> {sub.duration} min</div>
            <h4 className="text-base font-bold text-slate-800" style={{ fontFamily: "Sora" }}>{sub.short}</h4>
            <p className="mt-1 text-xs text-slate-400">{sub.questions.length} Qs</p>
            <div className="mt-4"><WeightageBar topics={sub.topics} accent={sub.accent} /></div>
            <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-sky-600">Practice now <ChevronRight size={16} /></div>
          </button>
        ))}
      </div>

      {adminTests.length > 0 && (
        <>
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-400"><ShieldCheck size={14} className="text-pink-500" /> My Created Tests</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {adminTests.map((t, i) => (
              <button key={i} onClick={() => nav(`/test/admin:${i}`)} className="flex flex-col rounded-2xl border border-pink-200 bg-pink-50/40 p-5 text-left shadow-sm hover:shadow-md">
                <div className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-pink-100 px-2.5 py-1 text-[11px] font-semibold text-pink-600"><ShieldCheck size={12} /> Admin Created</div>
                <h4 className="text-base font-bold text-slate-800" style={{ fontFamily: "Sora" }}>{t.title}</h4>
                <p className="mt-1 text-xs text-slate-400">{t.questions.length} Qs · {t.duration} min</p>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}