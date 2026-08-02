import React, { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { SUBJECTS } from "../data/subjects";
import WeightageBar from "./WeightageBar";
import { useApp } from "../context/AppContext";
import { getAdminTestsLocal } from "../lib/storage";
import { generatePredictedSet } from "../lib/predictor";
import { getFocusTopics, getWeakestTopicQuestions } from "../lib/analysis";
import { getDaysUntilExam, EXAM_DATE } from "../lib/examDate";
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
  AlertCircle,
  Calendar,
  Zap,
} from "lucide-react";

export default function Dashboard() {
  const nav = useNavigate();
  const { streak } = useApp();
  const adminTests = getAdminTestsLocal();
  const combinedTopicCount = SUBJECTS.reduce((s, sub) => s + sub.topics.length, 0);

  // ------------------------------------------------------------------
  // PRACTICE VS EXAM MODE
  // Controls whether TestRunner shows instant right/wrong feedback
  // (practice) or stays blind until the end (exam). Persisted so it
  // sticks between visits. See src/components/TestRunner.tsx for the
  // consuming logic (isPracticeMode / answeredAlready).
  // ------------------------------------------------------------------
  const [mode, setMode] = useState<"practice" | "exam">(
    (localStorage.getItem("siprep_test_mode") as "practice" | "exam") || "exam"
  );

  function setModeAndSave(m: "practice" | "exam") {
    setMode(m);
    localStorage.setItem("siprep_test_mode", m);
  }

  // Single navigation helper — every "start a test" button should route
  // through this so the mode query param always gets attached.
  function startTest(path: string) {
    nav(`${path}?mode=${mode}`);
  }

  // ------------------------------------------------------------------
  // DAILY REMINDER
  // See src/lib/notifications.ts for the underlying watcher, started
  // once in App.tsx via startReminderWatcher().
  // ------------------------------------------------------------------
  const [reminderTime, setReminderTimeState] = useState(getReminderTime() || "");

  async function handleSetReminder(time: string) {
    const granted = await requestNotificationPermission();
    markAsked();
    if (!granted) {
      alert("Notifications are blocked. Enable them in your browser's site settings to get daily reminders.");
      return;
    }
    setReminderTime(time);
    setReminderTimeState(time);
  }

  // ------------------------------------------------------------------
  // RULE-BASED PREDICTED QUESTION GENERATOR
  // Only covers Reasoning topics with a real formula (see
  // src/lib/predictor.ts — GENERATORS map). GS/English/Telugu can't be
  // generated this way; those need curated content via Admin → Add Note
  // / Admin → Create Mock Test instead.
  // ------------------------------------------------------------------
  function generateReasoningSet() {
    const reasoningTopics = SUBJECTS.find((s) => s.id === "reasoning")!.topics.map((t) => t.name);
    const fresh = generatePredictedSet(reasoningTopics, 2);
    sessionStorage.setItem("generated-set", JSON.stringify(fresh));
    startTest("/test/generated");
  }

  // ------------------------------------------------------------------
  // FOCUS AREAS & QUICK DRILL
  // Combines syllabus weightage with your actual attempt history to
  // surface what's most worth studying right now.
  // ------------------------------------------------------------------
  const focusTopics = useMemo(() => getFocusTopics(4), []);
  const daysLeft = useMemo(() => getDaysUntilExam(), []);

  function startQuickDrill() {
    const drill = getWeakestTopicQuestions(5);
    if (!drill) return;
    sessionStorage.setItem("generated-set", JSON.stringify(drill.questions));
    startTest("/test/generated");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* ---------------------------------------------------------- */}
      {/* HEADER: title + reminder + streak + mode toggle             */}
      {/* ---------------------------------------------------------- */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-slate-400">TS Police SI Recruitment 2026</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-800 sm:text-3xl" style={{ fontFamily: "Sora" }}>
            Mock Test Center
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <Bell size={18} className="text-sky-500" />
            <div>
              <label className="block text-[11px] text-slate-400">Daily reminder</label>
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
              <p className="text-lg font-bold leading-none text-slate-800">{streak.count}</p>
              <p className="text-[11px] text-slate-500">day streak</p>
            </div>
            <div className="ml-2 flex gap-1">
              {streak.last7.map((v, i) => (
                <span key={i} className={`h-6 w-1.5 rounded-full ${v ? "bg-yellow-400" : "bg-slate-200"}`} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Practice / Exam mode toggle — sits under the header row */}
      <div className="mb-8 flex items-center gap-3">
        <div className="flex items-center gap-1 rounded-2xl border border-slate-200 bg-white p-1">
          <button
            onClick={() => setModeAndSave("practice")}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold ${mode === "practice" ? "bg-sky-500 text-white" : "text-slate-500"}`}
          >
            <Eye size={14} /> Practice
          </button>
          <button
            onClick={() => setModeAndSave("exam")}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold ${mode === "exam" ? "bg-slate-900 text-white" : "text-slate-500"}`}
          >
            <EyeOff size={14} /> Exam
          </button>
        </div>
        <p className="text-[11px] text-slate-400">
          {mode === "practice" ? "Instant feedback after each answer" : "See results only at the end — real exam style"}
        </p>
      </div>

      {/* ---------------------------------------------------------- */}
      {/* FOCUS AREAS — data-driven "study this next" widget          */}
      {/* ---------------------------------------------------------- */}
      {focusTopics.length > 0 && (
        <div className="mb-8 rounded-2xl border border-pink-200 bg-pink-50/40 p-5">
          <div className="mb-3 flex items-center gap-2">
            <AlertCircle size={18} className="text-pink-500" />
            <h3 className="text-sm font-bold text-slate-800" style={{ fontFamily: "Sora" }}>Focus Areas</h3>
            <span className="text-[11px] text-slate-400">— highest weightage, lowest accuracy</span>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {focusTopics.map((f) => (
              <div key={f.topic} className="flex items-center justify-between rounded-xl bg-white px-3 py-2.5">
                <div>
                  <p className="text-xs font-semibold text-slate-800">{f.topic}</p>
                  <p className="text-[10px] text-slate-400">
                    {f.subject} · {f.weight}% weightage
                    {f.attempts > 0 ? ` · ${f.accuracy.toFixed(0)}% accuracy` : " · not attempted yet"}
                  </p>
                </div>
                <Link to={`/syllabus/${f.subjectId}`} className="whitespace-nowrap text-[11px] font-semibold text-pink-600">
                  Review →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------- */}
      {/* COMBINED FULL-LENGTH TEST HERO                               */}
      {/* ---------------------------------------------------------- */}
      <button
        onClick={() => startTest("/test/combined")}
        className="group mb-8 block w-full rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-50 to-white p-6 text-left transition hover:border-sky-300 sm:p-8"
      >
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-600">
              <Layers size={14} /> Full Length Test
            </div>
            <h2 className="text-xl font-bold text-slate-800 sm:text-2xl" style={{ fontFamily: "Sora" }}>
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

      {/* ---------------------------------------------------------- */}
      {/* PAPER-WISE PRACTICE CARDS + GENERATED SET TILE               */}
      {/* ---------------------------------------------------------- */}
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">Paper-wise Practice</h3>
      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SUBJECTS.map((sub) => (
          <div
            key={sub.id}
            className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
              <BookOpen size={12} /> {sub.duration} min
            </div>
            <h4 className="text-base font-bold text-slate-800" style={{ fontFamily: "Sora" }}>
              {sub.short}
            </h4>
            <p className="mt-1 text-xs text-slate-400">{sub.questions.length} Qs</p>
            <div className="mt-4">
              <WeightageBar topics={sub.topics} accent={sub.accent} />
            </div>
            <button
              onClick={() => startTest(`/test/${sub.id}`)}
              className="mt-4 flex items-center gap-1 text-sm font-semibold text-sky-600"
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

        {/* Rule-based generated Reasoning set */}
        <button
          onClick={generateReasoningSet}
          className="flex flex-col rounded-2xl border border-sky-200 bg-sky-50/40 p-5 text-left shadow-sm transition hover:shadow-md"
        >
          <div className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-sky-100 px-2.5 py-1 text-[11px] font-semibold text-sky-600">
            <Wand2 size={12} /> Fresh Set
          </div>
          <h4 className="text-base font-bold text-slate-800" style={{ fontFamily: "Sora" }}>
            Generate New Reasoning Qs
          </h4>
          <p className="mt-1 text-xs text-slate-400">
            Freshly generated, never repeated — Number Series, SI, Time & Work, Averages, Clocks
          </p>
        </button>
      </div>

      {/* ---------------------------------------------------------- */}
      {/* ADMIN-CREATED TESTS — only rendered if any exist             */}
      {/* ---------------------------------------------------------- */}
      {adminTests.length > 0 && (
        <>
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
            <ShieldCheck size={14} className="text-pink-500" /> My Created Tests
          </h3>
          <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {adminTests.map((t, i) => (
              <button
                key={i}
                onClick={() => startTest(`/test/admin:${i}`)}
                className="flex flex-col rounded-2xl border border-pink-200 bg-pink-50/40 p-5 text-left shadow-sm hover:shadow-md"
              >
                <div className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-pink-100 px-2.5 py-1 text-[11px] font-semibold text-pink-600">
                  <ShieldCheck size={12} /> Admin Created
                </div>
                <h4 className="text-base font-bold text-slate-800" style={{ fontFamily: "Sora" }}>
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

      {/* ---------------------------------------------------------- */}
      {/* EXAM COUNTDOWN + QUICK DRILL                                 */}
      {/* ---------------------------------------------------------- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <Calendar className="text-sky-500" size={24} />
          <div>
            <p className="text-lg font-bold text-slate-800">
              {daysLeft > 0 ? `${daysLeft} days left` : "Exam date passed or not yet updated"}
            </p>
            <p className="text-[11px] text-slate-400">
              Estimated — TSLPRB hasn't confirmed the prelims date yet. Placeholder: {EXAM_DATE.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        </div>

        {focusTopics.length > 0 && (
          <button onClick={startQuickDrill} className="flex items-center gap-3 rounded-2xl border border-pink-200 bg-pink-50/40 p-5 text-left shadow-sm hover:shadow-md">
            <Zap className="text-pink-500" size={24} />
            <div>
              <p className="text-sm font-bold text-slate-800">5-Question Quick Drill</p>
              <p className="text-[11px] text-slate-500">Targets your weakest topic: {focusTopics[0].topic}</p>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}