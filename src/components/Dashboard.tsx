import React, { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { SUBJECTS } from "../data/subjects";
import WeightageBar from "./WeightageBar";
import { useApp } from "../context/AppContext";
import { getAdminTestsLocal, getMistakes } from "../lib/storage";
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
  RotateCcw,
} from "lucide-react";

// Reusable wrapper so every section on the dashboard looks visually
// distinct — its own card, its own heading, its own icon. Add new
// dashboard sections by wrapping them in this, not by adding more
// loose <div>s directly under the page.
function SectionCard({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8 rounded-3xl border border-slate-200 bg-white/70 p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        {icon}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700" style={{ fontFamily: "Sora" }}>
            {title}
          </h2>
          {subtitle && <p className="text-[11px] text-slate-400">{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

export default function Dashboard() {
  const nav = useNavigate();
  const { streak } = useApp();
  const adminTests = getAdminTestsLocal();
  const combinedTopicCount = SUBJECTS.reduce((s, sub) => s + sub.topics.length, 0);

  // ------------------------------------------------------------------
  // PRACTICE VS EXAM MODE
  // ------------------------------------------------------------------
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

  // ------------------------------------------------------------------
  // DAILY REMINDER
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
  // RULE-BASED PREDICTED QUESTION GENERATOR (Reasoning only)
  // ------------------------------------------------------------------
  function generateReasoningSet() {
    const reasoningTopics = SUBJECTS.find((s) => s.id === "reasoning")!.topics.map((t) => t.name);
    const fresh = generatePredictedSet(reasoningTopics, 2);
    sessionStorage.setItem("generated-set", JSON.stringify(fresh));
    startTest("/test/generated");
  }

  // ------------------------------------------------------------------
  // FOCUS AREAS, COUNTDOWN & QUICK DRILL
  // ------------------------------------------------------------------
  const focusTopics = useMemo(() => getFocusTopics(4), []);
  const daysLeft = useMemo(() => getDaysUntilExam(), []);
  const mistakes = useMemo(() => getMistakes(), []);

  function startQuickDrill() {
    const drill = getWeakestTopicQuestions(5);
    if (!drill) return;
    sessionStorage.setItem("generated-set", JSON.stringify(drill.questions));
    startTest("/test/generated");
  }

  function startMistakesReview() {
    const questions = mistakes
      .sort((a, b) => b.missedCount - a.missedCount)
      .slice(0, 15)
      .map((m) => ({ ...m, accent: "pink" as const }));
    sessionStorage.setItem("generated-set", JSON.stringify(questions));
    startTest("/test/generated");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* ============ TOP BAR: title + reminder + streak ============ */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-slate-400">TS Police SI Recruitment 2026</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-800 sm:text-3xl" style={{ fontFamily: "Sora" }}>
            SI Prep
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

      {/* Practice / Exam mode toggle */}
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

      {/* ============ SECTION: YOUR INSIGHTS ============ */}
      <SectionCard
        title="Your Insights"
        subtitle="Focus areas, exam countdown, and a quick drill"
        icon={<AlertCircle size={18} className="text-pink-500" />}
      >
        {focusTopics.length > 0 && (
          <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {focusTopics.map((f) => (
              <div key={f.topic} className="flex items-center justify-between rounded-xl bg-pink-50/60 px-3 py-2.5">
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
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
            <Calendar className="text-sky-500" size={22} />
            <div>
              <p className="text-sm font-bold text-slate-800">
                {daysLeft !== null ? `${daysLeft} days left` : "Exam date not yet announced"}
              </p>
              <p className="text-[11px] text-slate-400">
                Applications open ~Aug 2026. Check tslprb.in for the confirmed prelims date.
              </p>
            </div>
          </div>

          {focusTopics.length > 0 && (
            <button
              onClick={startQuickDrill}
              className="flex items-center gap-3 rounded-xl border border-pink-200 bg-pink-50/40 p-4 text-left hover:shadow-sm"
            >
              <Zap className="text-pink-500" size={22} />
              <div>
                <p className="text-sm font-bold text-slate-800">5-Question Quick Drill</p>
                <p className="text-[11px] text-slate-500">Targets: {focusTopics[0].topic}</p>
              </div>
            </button>
          )}
        </div>

        {mistakes.length > 0 && (
          <button
            onClick={startMistakesReview}
            className="mt-4 flex w-full items-center justify-between rounded-xl border border-pink-200 bg-pink-50/60 p-4 text-left hover:shadow-sm"
          >
            <div className="flex items-center gap-3">
              <RotateCcw className="text-pink-500" size={20} />
              <div>
                <p className="text-sm font-bold text-slate-800">Review Your Mistakes</p>
                <p className="text-[11px] text-slate-500">{mistakes.length} question(s) you've gotten wrong before</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-pink-600">Start →</span>
          </button>
        )}
      </SectionCard>

      {/* ============ SECTION: MOCK TESTS ============ */}
      <SectionCard
        title="Mock Tests"
        subtitle="Combined simulation, paper-wise practice, and generated sets"
        icon={<Layers size={18} className="text-sky-500" />}
      >
        <button
          onClick={() => startTest("/test/combined")}
          className="group mb-6 block w-full rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 to-white p-6 text-left transition hover:border-sky-300"
        >
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-lg font-bold text-slate-800" style={{ fontFamily: "Sora" }}>
                Combined Prelims Simulation
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                All 4 papers, {combinedTopicCount} topics, real exam timing.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start rounded-xl bg-sky-500 px-5 py-3 font-semibold text-white group-hover:bg-sky-600 sm:self-center">
              Start Test <ArrowRight size={18} />
            </div>
          </div>
        </button>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
            </div>
          ))}

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
      </SectionCard>

      {/* ============ SECTION: NOTES & SYLLABUS ============ */}
      <SectionCard
        title="Notes & Syllabus"
        subtitle="Full topic breakdown and study notes, per subject"
        icon={<BookOpenCheck size={18} className="text-emerald-500" />}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SUBJECTS.map((sub) => (
            <Link
              key={sub.id}
              to={`/syllabus/${sub.id}`}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <BookOpenCheck size={18} className="mb-2 text-emerald-500" />
              <h4 className="text-base font-bold text-slate-800" style={{ fontFamily: "Sora" }}>
                {sub.short}
              </h4>
              <p className="mt-1 text-xs text-slate-400">{sub.topics.length} topics</p>
              <span className="mt-3 text-sm font-semibold text-emerald-600">View Syllabus & Notes →</span>
            </Link>
          ))}
        </div>
      </SectionCard>

      {/* ============ SECTION: ADMIN-CREATED TESTS ============ */}
      {adminTests.length > 0 && (
        <SectionCard
          title="My Created Tests"
          subtitle="Built by you in the Admin panel — not from the internet"
          icon={<ShieldCheck size={18} className="text-pink-500" />}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {adminTests.map((t, i) => (
              <button
                key={i}
                onClick={() => startTest(`/test/admin:${i}`)}
                className="flex flex-col rounded-2xl border border-pink-200 bg-pink-50/40 p-5 text-left shadow-sm hover:shadow-md"
              >
                <ShieldCheck size={16} className="mb-2 text-pink-500" />
                <h4 className="text-base font-bold text-slate-800" style={{ fontFamily: "Sora" }}>
                  {t.title}
                </h4>
                <p className="mt-1 text-xs text-slate-400">
                  {t.questions.length} Qs · {t.duration} min
                </p>
              </button>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  );
}