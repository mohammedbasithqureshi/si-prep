import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SUBJECTS } from "../data/subjects";
import {
  getAdminTestsLocal,
  saveAttempt,
  addBookmark,
  removeBookmark,
  isBookmarked,
} from "../lib/storage";
import { Question, TestResult } from "../types";
import { Timer, Flag, ChevronLeft, ChevronRight, Menu, X, Star, CheckCircle2, XCircle } from "lucide-react";
import { useApp } from "../context/AppContext";

const accentBg = {
  sky: "bg-sky-500",
  yellow: "bg-yellow-400",
  pink: "bg-pink-500",
} as const;
const accentSoft = {
  sky: "bg-sky-50 border-sky-200 text-sky-600",
  yellow: "bg-yellow-50 border-yellow-200 text-yellow-600",
  pink: "bg-pink-50 border-pink-200 text-pink-600",
} as const;

type RunnerQuestion = Question & {
  subject: string;
  accent: "sky" | "yellow" | "pink";
};

export default function TestRunner() {
  const { testId } = useParams();
  const nav = useNavigate();
  const { refreshStreak } = useApp();

  const isCombined = testId === "combined";
  const isAdmin = testId?.startsWith("admin:");
  const adminTest = isAdmin
    ? getAdminTestsLocal()[Number(testId!.split(":")[1])]
    : null;

  const questions: RunnerQuestion[] = useMemo(() => {
    if (isAdmin && adminTest) {
      return adminTest.questions.map((q: Question) => ({
        ...q,
        subject: adminTest.title,
        accent: "pink" as const,
      }));
    }
    if (!testId) return [];
    const active = isCombined
      ? SUBJECTS
      : SUBJECTS.filter((s) => s.id === testId);
    return active.flatMap((s) =>
      s.questions.map((q) => ({
        ...q,
        subject: s.short,
        accent: s.accent,
      }))
    );
  }, [testId, isAdmin, isCombined, adminTest]);

  const totalSeconds = useMemo(() => {
    if (isAdmin && adminTest) return adminTest.duration * 60;
    if (isCombined) {
      return SUBJECTS.reduce((sum, sub) => sum + sub.duration, 0) * 60;
    }
    const subject = SUBJECTS.find((s) => s.id === testId);
    return (subject?.duration ?? 0) * 60;
  }, [testId, isAdmin, isCombined, adminTest]);

  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [marked, setMarked] = useState<Record<string, boolean>>({});
  const [starred, setStarred] = useState<Record<string, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const answersRef = useRef(answers);
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    if (questions.length === 0) return;
    const map: Record<string, boolean> = {};
    questions.forEach((qq) => {
      map[qq.id] = isBookmarked(qq.id);
    });
    setStarred(map);
  }, [questions]);

  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(
    undefined
  );

  function buildResult(currentAnswers: Record<string, number>): TestResult {
    let correct = 0;
    let wrong = 0;
    let skipped = 0;
    const perTopic: Record<string, { correct: number; total: number }> = {};
    questions.forEach((qq) => {
      const given = currentAnswers[qq.id];
      if (given === undefined) skipped++;
      else if (given === qq.answer) correct++;
      else wrong++;
      const topic = qq.topic || "General";
      if (!perTopic[topic]) perTopic[topic] = { correct: 0, total: 0 };
      perTopic[topic].total++;
      if (given === qq.answer) perTopic[topic].correct++;
    });
    return {
      correct,
      wrong,
      skipped,
      total: questions.length,
      marks: correct - wrong * 0.25,
      perTopic,
    };
  }

  function finish() {
    if (timerRef.current) clearInterval(timerRef.current);
    const result = buildResult(answersRef.current);
    saveAttempt({ testId, date: new Date().toISOString(), ...result });
    refreshStreak();
    nav("/results", { state: { result } });
  }

  useEffect(() => {
    if (totalSeconds <= 0 || questions.length === 0) return;
    setTimeLeft(totalSeconds);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          finish();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalSeconds, questions.length]);

  function fmt(s: number) {
    const h = String(Math.floor(s / 3600)).padStart(2, "0");
    const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
    const sec = String(s % 60).padStart(2, "0");
    return `${h}:${m}:${sec}`;
  }

  function toggleStar(q: RunnerQuestion) {
    const currentlyStarred = starred[q.id];
    if (currentlyStarred) {
      removeBookmark(q.id);
      setStarred((p) => ({ ...p, [q.id]: false }));
    } else {
      addBookmark({
        id: q.id,
        type: "question",
        text: q.text,
        subject: q.subject,
        topic: q.topic,
        options: q.options,
        answer: q.answer,
      });
      setStarred((p) => ({ ...p, [q.id]: true }));
    }
  }

  if (questions.length === 0) {
    return (
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-4">
        <p className="text-slate-500">No questions found for this test.</p>
        <button
          onClick={() => nav("/")}
          className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white"
        >
          Go Home
        </button>
      </div>
    );
  }

  const safeIdx = Math.min(idx, questions.length - 1);
  const q = questions[safeIdx];
  const accent = accentSoft[q.accent];
  const answeredAlready = answers[q.id] !== undefined;

  function selectOption(oi: number) {
    if (answeredAlready) return; // lock in first answer once feedback is shown
    setAnswers((p) => ({ ...p, [q.id]: oi }));
  }

  function statusOf(i: number) {
    const qq = questions[i];
    if (marked[qq.id]) return "bg-yellow-400 text-slate-900";
    if (answers[qq.id] !== undefined) return "bg-sky-500 text-white";
    return "bg-slate-100 text-slate-400 border border-slate-200";
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-4 sm:px-6 lg:px-8">
      <div className="mb-4 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <button onClick={() => nav("/")} className="text-sm text-slate-500">
          <X size={18} className="inline sm:hidden" />
          <span className="hidden sm:inline">Exit Test</span>
        </button>
        <div className="flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-1.5">
          <Timer
            size={16}
            className={timeLeft < 60 ? "text-pink-400" : "text-yellow-400"}
          />
          <span
            className={`text-sm font-bold ${
              timeLeft < 60 ? "text-pink-400" : "text-white"
            }`}
          >
            {fmt(timeLeft)}
          </span>
        </div>
        <button
          onClick={() => setPaletteOpen((p) => !p)}
          className="rounded-lg bg-slate-100 p-2 text-slate-600 lg:hidden"
        >
          <Menu size={18} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-4 lg:flex-row">
        <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <span
              className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${accent}`}
            >
              {q.subject}
              {q.topic ? ` · ${q.topic}` : ""}
            </span>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] text-slate-500">
              {q.source}
            </span>
          </div>

          <div className="mb-5 flex items-start justify-between gap-3">
            <p className="text-base font-medium leading-relaxed text-slate-800 sm:text-lg">
              <span className="mr-2 text-slate-400">Q{safeIdx + 1}.</span>
              {q.text}
            </p>
            <button
              onClick={() => toggleStar(q)}
              className={`rounded-full p-1.5 ${
                starred[q.id] ? "text-yellow-500" : "text-slate-300"
              }`}
            >
              <Star
                size={18}
                fill={starred[q.id] ? "currentColor" : "none"}
              />
            </button>
          </div>

          <div className="space-y-3">
            {q.options.map((opt: string, i: number) => {
              const isSelected = answers[q.id] === i;
              const isCorrectOption = i === q.answer;

              let style = "border-slate-200 text-slate-600 hover:border-slate-300";
              let badge = "bg-slate-100 text-slate-400";

              if (answeredAlready) {
                if (isCorrectOption) {
                  style = "border-emerald-300 bg-emerald-50 text-emerald-800";
                  badge = "bg-emerald-500 text-white";
                } else if (isSelected) {
                  style = "border-rose-300 bg-rose-50 text-rose-800";
                  badge = "bg-rose-500 text-white";
                } else {
                  style = "border-slate-200 text-slate-400 opacity-60";
                }
              } else if (isSelected) {
                style = accent;
                badge = `${accentBg[q.accent]} text-white`;
              }

              return (
                <button
                  key={i}
                  onClick={() => selectOption(i)}
                  disabled={answeredAlready}
                  className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${style} ${
                    answeredAlready ? "cursor-default" : ""
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${badge}`}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                  {answeredAlready && isCorrectOption && (
                    <CheckCircle2 size={16} className="ml-auto text-emerald-500" />
                  )}
                  {answeredAlready && isSelected && !isCorrectOption && (
                    <XCircle size={16} className="ml-auto text-rose-500" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() =>
                setMarked((p) => ({ ...p, [q.id]: !p[q.id] }))
              }
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold ${
                marked[q.id]
                  ? "bg-yellow-400 text-slate-900"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              <Flag size={14} /> Mark for Review
            </button>
            <div className="flex gap-2">
              <button
                disabled={safeIdx === 0}
                onClick={() => setIdx((i) => Math.max(0, i - 1))}
                className="flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-600 disabled:opacity-30"
              >
                <ChevronLeft size={16} /> Prev
              </button>
              {safeIdx === questions.length - 1 ? (
                <button
                  onClick={finish}
                  className="rounded-lg bg-pink-500 px-4 py-2 text-sm font-bold text-white"
                >
                  Submit Test
                </button>
              ) : (
                <button
                  onClick={() =>
                    setIdx((i) => Math.min(questions.length - 1, i + 1))
                  }
                  className={`flex items-center gap-1 rounded-lg ${accentBg[q.accent]} px-3 py-2 text-sm font-bold text-white`}
                >
                  Next <ChevronRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        <div
          className={`${
            paletteOpen ? "block" : "hidden"
          } w-full shrink-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:block lg:w-64`}
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Question Palette
          </p>
          <div className="grid grid-cols-8 gap-2 sm:grid-cols-10 lg:grid-cols-6">
            {questions.map((_: RunnerQuestion, i: number) => (
              <button
                key={i}
                onClick={() => {
                  setIdx(i);
                  setPaletteOpen(false);
                }}
                className={`flex h-8 w-8 items-center justify-center rounded-md text-xs font-bold ${statusOf(
                  i
                )} ${i === safeIdx ? "ring-2 ring-slate-800" : ""}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}