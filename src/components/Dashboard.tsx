import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { SUBJECTS } from "../data/subjects";
import WeightageBar from "./WeightageBar";
import { useApp } from "../context/AppContext";
import { getAdminTestsLocal } from "../lib/storage";
import { generatePredictedSet } from "../lib/predictor";
import {
  getReminderTime,
  setReminderTime,
  requestNotificationPermission,
  markAsked,
} from "../lib/notifications";
import {
  Flame,
  Layers,
  ArrowRight,
  BookOpen,
  ChevronRight,
  ShieldCheck,
  Wand2,
  Bell,
  BookOpenCheck,
  Eye,
  EyeOff,
} from "lucide-react";

export default function Dashboard() {
  const nav = useNavigate();
  const { streak } = useApp();
  const adminTests = getAdminTestsLocal();
  const combinedTopicCount = SUBJECTS.reduce(
    (s, sub) => s + sub.topics.length,
    0
  );

  const [reminderTime, setReminderTimeState] = useState(
    getReminderTime() || ""
  );

  const [mode, setMode] = useState<"practice" | "exam">(
    (localStorage.getItem("siprep_test_mode") as "practice" | "exam") || "exam"
  );

  function setModeAndSave(m: "practice" | "exam") {
    setMode(m);
    localStorage.setItem("siprep_test_mode", m);
  }

  function startTest(path: string) {
    nav(`${path}?mode=${mode}`);
  }

  async function handleSetReminder(time: string) {
    const granted = await requestNotificationPermission();
    markAsked();
    if (!granted) {
      alert(
        "Notifications are blocked. Enable them in your browser's site settings to get daily reminders."
      );
      return;
    }
    setReminderTime(time);
    setReminderTimeState(time);
  }

  function generateReasoningSet() {
    const reasoningTopics = SUBJECTS.find((s) => s.id === "reasoning")!.topics.map(
      (t) => t.name
    );
    const fresh = generatePredictedSet(reasoningTopics, 2); // 2 per generatable topic
    sessionStorage.setItem("generated-set", JSON.stringify(fresh));
    startTest("/test/generated");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-slate-400">TS Police SI Recruitment 2026</p>
          <h1
            className="mt-1 text-2xl font-bold text-slate-800 sm:text-3xl"
            style={{ fontFamily: "Sora" }}
          >
            Mock Test Center
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Mode Selection Switch */}
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 rounded-2xl border border-slate-200 bg-white p-1">
              <button
                type="button"
                onClick={() => setModeAndSave("practice")}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                  mode === "practice"
                    ? "bg-sky-500 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Eye size={14} /> Practice
              </button>
              <button
                type="button"
                onClick={() => setModeAndSave("exam")}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                  mode === "exam"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <EyeOff size={14} /> Exam
              </button>
            </div>
            <p className="mt-1 text-[10px] text-slate-400">
              {mode === "practice"
                ? "Instant feedback after each answer"
                : "See results only at the end — real exam style"}
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <Bell size={18} className="text-sky-500" />
            <div>
              <label className="block text-[11px] text-slate-400">
                Daily reminder
              </label>
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => handleSetReminder(e.target.value)}
                className="text-sm font-semibold text-slate-800 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-yellow-200 bg-yellow-50 px-4 py-3">
            <Flame className="text-yellow-500" size={22} />
            <div>
              <p className="text-lg font-bold leading-none text-slate-800">
                {streak.count}
              </p>
              <p className="text-[11px] text-slate-500">day streak</p>
            </div>
            <div className="ml-2 flex gap-1">
              {streak.last7.map((v, i) => (
                <span
                  key={i}
                  className={`h-6 w-1.5 rounded-full ${
                    v ? "bg-yellow-400" : "bg-slate-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Full Length Test Card */}
      <button
        type="button"
        onClick={() => startTest("/test/combined")}
        className="group mb-8 block w-full rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-50 to-white p-6 text-left transition hover:border-sky-300 sm:p-8"
      >
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-600">
              <Layers size={14} /> Full Length Test
            </div>
            <h2
              className="text-xl font-bold text-slate-800 sm:text-2xl"
              style={{ fontFamily: "Sora" }}
            >
              Combined Prelims Simulation
            </h2>
            <p className="mt-1 max-w-xl text-sm text-slate-500">
              All 4 papers, {combinedTopicCount} topics, real exam timing.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start rounded-xl bg-sky-500 px-5 py-3 font-semibold text-white group-hover:bg-sky-600 sm:self-center">
            Start Test <ArrowRight size={18} />
          </div>
        </div>
      </button>

      {/* Subject Wise Cards */}
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">
        Paper-wise Practice
      </h3>
      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SUBJECTS.map((sub) => (
          <div
            key={sub.id}
            className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
              <BookOpen size={12} /> {sub.duration} min
            </div>
            <h4
              className="text-base font-bold text-slate-800"
              style={{ fontFamily: "Sora" }}
            >
              {sub.short}
            </h4>
            <p className="mt-1 text-xs text-slate-400">
              {sub.questions.length} Qs
            </p>
            <div className="mt-4">
              <WeightageBar topics={sub.topics} accent={sub.accent} />
            </div>
            <button
              type="button"
              onClick={() => startTest(`/test/${sub.id}`)}
              className="mt-4 flex items-center gap-1 text-sm font-semibold text-sky-600 hover:text-sky-700"
            >
              Practice now <ChevronRight size={16} />
            </button>
            <Link
              to={`/syllabus/${sub.id}`}
              className="mt-2 flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-slate-600"
            >
              <BookOpenCheck size={12} /> Syllabus & Notes
            </Link>
          </div>
        ))}

        {/* Fresh generated reasoning set */}
        <button
          type="button"
          onClick={generateReasoningSet}
          className="flex flex-col rounded-2xl border border-sky-200 bg-sky-50/40 p-5 text-left shadow-sm transition hover:shadow-md"
        >
          <div className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-sky-100 px-2.5 py-1 text-[11px] font-semibold text-sky-600">
            <Wand2 size={12} /> Fresh Set
          </div>
          <h4
            className="text-base font-bold text-slate-800"
            style={{ fontFamily: "Sora" }}
          >
            Generate New Reasoning Qs
          </h4>
          <p className="mt-1 text-xs text-slate-400">
            Freshly generated, never repeated — Number Series, SI, Time & Work,
            Averages, Clocks
          </p>
        </button>
      </div>

      {/* Admin Created Tests */}
      {adminTests.length > 0 && (
        <>
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
            <ShieldCheck size={14} className="text-pink-500" /> My Created Tests
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {adminTests.map((t, i) => (
              <button
                key={i}
                type="button"
                onClick={() => startTest(`/test/admin:${i}`)}
                className="flex flex-col rounded-2xl border border-pink-200 bg-pink-50/40 p-5 text-left shadow-sm hover:shadow-md"
              >
                <div className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-pink-100 px-2.5 py-1 text-[11px] font-semibold text-pink-600">
                  <ShieldCheck size={12} /> Admin Created
                </div>
                <h4
                  className="text-base font-bold text-slate-800"
                  style={{ fontFamily: "Sora" }}
                >
                  {t.title}
                </h4>
                <p className="mt-1 text-xs text-slate-400">
                  {t.questions.length} Qs · {t.duration} min
                </p>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}