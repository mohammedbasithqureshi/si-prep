import React, { useMemo } from "react";
import { getAttempts } from "../lib/storage";
import { TrendingUp, TrendingDown, Minus, Calendar } from "lucide-react";

export default function Progress() {
  const attempts = getAttempts();

  const stats = useMemo(() => {
    if (attempts.length === 0) return null;
    const totalTests = attempts.length;
    const avgScore = attempts.reduce((s, a) => s + (a.marks / a.total) * 100, 0) / totalTests;
    const bestScore = Math.max(...attempts.map((a) => (a.marks / a.total) * 100));
    const recent = attempts.slice(0, 5);
    const older = attempts.slice(5, 10);
    const recentAvg = recent.length ? recent.reduce((s, a) => s + (a.marks / a.total) * 100, 0) / recent.length : 0;
    const olderAvg = older.length ? older.reduce((s, a) => s + (a.marks / a.total) * 100, 0) / older.length : recentAvg;
    const trend = recentAvg - olderAvg;

    const bySubject: Record<string, { attempts: number; avgAccuracy: number }> = {};
    attempts.forEach((a) => {
      const key = a.testId || "unknown";
      if (!bySubject[key]) bySubject[key] = { attempts: 0, avgAccuracy: 0 };
      bySubject[key].attempts++;
      bySubject[key].avgAccuracy += (a.marks / a.total) * 100;
    });
    Object.keys(bySubject).forEach((k) => { bySubject[k].avgAccuracy /= bySubject[k].attempts; });

    return { totalTests, avgScore, bestScore, trend, bySubject };
  }, [attempts]);

  if (!stats) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
        <Calendar className="mx-auto mb-3 text-slate-300" size={32} />
        <h1 className="text-xl font-bold text-slate-800" style={{ fontFamily: "Sora" }}>No attempts yet</h1>
        <p className="mt-1 text-sm text-slate-400">Take a mock test and your progress will show up here.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-slate-800" style={{ fontFamily: "Sora" }}>Your Progress</h1>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-[11px] text-slate-400">Tests Taken</p>
          <p className="mt-1 text-2xl font-bold text-slate-800">{stats.totalTests}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-[11px] text-slate-400">Average Score</p>
          <p className="mt-1 text-2xl font-bold text-slate-800">{stats.avgScore.toFixed(1)}%</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-[11px] text-slate-400">Best Score</p>
          <p className="mt-1 text-2xl font-bold text-sky-600">{stats.bestScore.toFixed(1)}%</p>
        </div>
      </div>

      <div className="mb-8 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        {stats.trend > 2 ? <TrendingUp className="text-sky-500" size={22} /> : stats.trend < -2 ? <TrendingDown className="text-pink-500" size={22} /> : <Minus className="text-slate-400" size={22} />}
        <div>
          <p className="text-sm font-semibold text-slate-800">
            {stats.trend > 2 ? "Improving" : stats.trend < -2 ? "Recent dip" : "Steady"}
          </p>
          <p className="text-[11px] text-slate-400">
            Last 5 tests vs previous 5 — {stats.trend > 0 ? "+" : ""}{stats.trend.toFixed(1)}% change
          </p>
        </div>
      </div>

      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">By Test Type</h3>
      <div className="mb-8 space-y-3">
        {Object.entries(stats.bySubject).map(([key, v]) => (
          <div key={key}>
            <div className="mb-1 flex justify-between text-xs text-slate-600">
              <span className="capitalize">{key.replace("admin:", "Admin Test #")}</span>
              <span>{v.attempts} attempts · {v.avgAccuracy.toFixed(1)}% avg</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100">
              <div className={`h-full rounded-full ${v.avgAccuracy >= 60 ? "bg-sky-500" : v.avgAccuracy >= 35 ? "bg-yellow-400" : "bg-pink-500"}`} style={{ width: `${v.avgAccuracy}%` }} />
            </div>
          </div>
        ))}
      </div>

      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">Recent Attempts</h3>
      <div className="space-y-2">
        {attempts.slice(0, 10).map((a, i) => (
          <div key={i} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">
            <div>
              <p className="text-sm font-semibold capitalize text-slate-800">{a.testId?.replace("admin:", "Admin Test #") || "Test"}</p>
              <p className="text-[11px] text-slate-400">{new Date(a.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
            </div>
            <p className="text-sm font-bold text-slate-800">{((a.marks / a.total) * 100).toFixed(1)}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}