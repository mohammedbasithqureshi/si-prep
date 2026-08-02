import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FLASHCARDS_SEED } from "../data/flashcards";
import { Flashcard, CurrentAffairsItem } from "../types";
import { getFlashcardState, addBookmark, removeBookmark } from "../lib/storage";
import { fetchCurrentAffairs } from "../lib/api";
import { buildCurrentAffairsQuiz } from "../lib/caQuizGenerator";
import { Star, Newspaper, Brain, RefreshCw, Zap } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Flashcards() {
  const nav = useNavigate();
  const { refreshStreak } = useApp();
  const [starState, setStarState] = useState(getFlashcardState());
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState<"all" | "starred" | "current-affairs">("all");
  const [caCards, setCaCards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadCurrentAffairs() {
    setLoading(true);
    setError(null);
    try {
      const items: CurrentAffairsItem[] = await fetchCurrentAffairs();
      const cards: Flashcard[] = items.slice(0, 10).map((item, i) => ({
        id: `ca-${i}-${item.link}`,
        type: "current-affairs",
        subject: item.source,
        accent: "yellow",
        front: item.title,
        back: `Source: ${item.source} — open the link for the full release.`,
        date: item.pubDate,
        starred: false,
      }));
      setCaCards(cards);
      if (cards.length === 0) {
        setError("No current affairs available right now — try refreshing later.");
      }
    } catch (e) {
      setError(
        "Couldn't load current affairs. Make sure the backend is running (vercel dev), not just vite dev."
      );
    } finally {
      setLoading(false);
    }
  }

  function startCAQuiz() {
    const caItems = caCards.map((c) => ({
      title: c.front,
      link: "",
      pubDate: c.date || "",
      source: c.subject,
    }));

    if (caItems.length < 4) {
      alert("Not enough current affairs loaded yet to build a quiz — try refreshing first.");
      return;
    }

    const quiz = buildCurrentAffairsQuiz(caItems, 5).map((q) => ({
      ...q,
      subject: "Current Affairs",
      accent: "yellow" as const,
    }));

    sessionStorage.setItem("generated-set", JSON.stringify(quiz));
    nav("/test/generated?mode=practice");
  }

  useEffect(() => {
    loadCurrentAffairs();
  }, []);

  // Studying flashcards counts toward the streak
  useEffect(() => {
    refreshStreak();
  }, []);

  const allCards = [...FLASHCARDS_SEED, ...caCards];
  const visible = allCards.filter((c) => {
    if (filter === "starred") return !!starState[c.id] || c.starred;
    if (filter === "current-affairs") return c.type === "current-affairs";
    return true;
  });

  function star(c: Flashcard) {
    const nowStarred = !starState[c.id];
    setStarState((p) => ({ ...p, [c.id]: nowStarred }));
    if (nowStarred) {
      addBookmark({
        id: c.id,
        type: "flashcard",
        text: c.front,
        subject: c.subject,
        back: c.back,
      });
    } else {
      removeBookmark(c.id);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800" style={{ fontFamily: "Sora" }}>
            Flashcards
          </h1>
          <p className="mt-1 text-sm text-slate-500">Important concepts + live current affairs</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={startCAQuiz}
            className="flex items-center gap-1.5 rounded-xl bg-pink-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-pink-600"
          >
            <Zap size={14} /> Quiz Me on This
          </button>

          <button
            onClick={loadCurrentAffairs}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-xl bg-sky-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-sky-600 disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            {loading ? "Fetching..." : "Refresh Current Affairs"}
          </button>
        </div>
      </div>

      {error && <p className="mb-4 text-xs font-medium text-pink-600">{error}</p>}

      <div className="mb-6 flex gap-2">
        {(["all", "starred", "current-affairs"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition ${
              filter === s ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
          >
            {s.replace("-", " ")}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((c) => (
          <div
            key={c.id}
            className="flex min-h-[160px] flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                {c.type === "current-affairs" ? <Newspaper size={11} /> : <Brain size={11} />}{" "}
                {c.subject}
              </span>
              <button
                onClick={() => star(c)}
                className={`rounded-full p-1 transition ${starState[c.id] ? "text-yellow-500" : "text-slate-300 hover:text-slate-400"}`}
              >
                <Star size={16} fill={starState[c.id] ? "currentColor" : "none"} />
              </button>
            </div>
            <button
              onClick={() => setFlipped((p) => ({ ...p, [c.id]: !p[c.id] }))}
              className="flex flex-1 flex-col items-center justify-center text-center"
            >
              <p className="text-sm font-semibold text-slate-800">
                {flipped[c.id] ? c.back : c.front}
              </p>
              {c.date && !flipped[c.id] && (
                <p className="mt-1 text-[10px] text-slate-400">{c.date}</p>
              )}
            </button>
          </div>
        ))}
        {visible.length === 0 && (
          <p className="col-span-full py-10 text-center text-sm text-slate-400">
            No cards in this filter yet.
          </p>
        )}
      </div>
    </div>
  );
}