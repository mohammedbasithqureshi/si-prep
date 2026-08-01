import React, { useState } from "react";
import { getBookmarks, removeBookmark, BookmarkItem } from "../lib/storage";
import { Star, Trash2, Brain, Newspaper } from "lucide-react";

export default function Bookmarks() {
  const [items, setItems] = useState<BookmarkItem[]>(getBookmarks());
  const [filter, setFilter] = useState<"all" | "question" | "flashcard">("all");

  function remove(id: string) {
    setItems(removeBookmark(id));
  }

  const visible = items.filter((i) => filter === "all" || i.type === filter);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800" style={{ fontFamily: "Sora" }}>Bookmarks</h1>
        <p className="mt-1 text-sm text-slate-500">Everything you've starred — {items.length} saved</p>
      </div>

      <div className="mb-6 flex gap-2">
        {(["all", "question", "flashcard"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${filter === f ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-500"}`}
          >
            {f === "all" ? "All" : f + "s"}
          </button>
        ))}
      </div>

      {visible.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <Star className="mx-auto mb-2 text-slate-300" size={28} />
          <p className="text-sm text-slate-400">No bookmarks yet — tap the star icon on any question or flashcard to save it here.</p>
        </div>
      )}

      <div className="space-y-3">
        {visible.map((item) => (
          <div key={item.id} className="rounded-2xl border border-yellow-200 bg-yellow-50/40 p-4 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                {item.type === "flashcard" ? <Brain size={11} /> : <Newspaper size={11} />} {item.subject}{item.topic ? ` · ${item.topic}` : ""}
              </span>
              <button onClick={() => remove(item.id)} className="text-slate-400 hover:text-rose-500">
                <Trash2 size={16} />
              </button>
            </div>
            <p className="text-sm font-medium text-slate-800">{item.text}</p>
            {item.options && item.answer !== undefined && (
              <p className="mt-1 text-xs text-slate-500">Answer: {item.options[item.answer]}</p>
            )}
            {item.back && <p className="mt-1 text-xs text-slate-500">{item.back}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}