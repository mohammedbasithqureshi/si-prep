import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { SUBJECTS } from "../data/subjects";
import { NOTES } from "../data/notes";
import { getCustomNotes } from "../lib/storage";
import { ChevronDown, ChevronUp, BookOpen, ArrowLeft } from "lucide-react";

const accentText = { sky: "text-sky-600", yellow: "text-yellow-600", pink: "text-pink-600" } as const;
const accentBg = { sky: "bg-sky-500", yellow: "bg-yellow-400", pink: "bg-pink-500" } as const;

export default function Syllabus() {
  const { subjectId } = useParams();
  const subject = SUBJECTS.find((s) => s.id === subjectId);
  const [expanded, setExpanded] = useState<string | null>(null);

  if (!subject) return <p className="p-8 text-center text-slate-400">Subject not found.</p>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link to="/" className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>
      <h1 className="mb-1 text-2xl font-bold text-slate-800" style={{ fontFamily: "Sora" }}>{subject.name}</h1>
      <p className="mb-6 text-sm text-slate-500">Full syllabus with topic weightage — tap a topic for notes</p>

      <div className="space-y-3">
        {subject.topics.map((topic) => {
          const isOpen = expanded === topic.name;
          const allNotes = [...NOTES, ...getCustomNotes()];
          const relatedNotes = allNotes.filter((n) => n.subject === subject.short && n.topic === topic.name);

          return (
            <div key={topic.name} className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <button
                onClick={() => setExpanded(isOpen ? null : topic.name)}
                className="flex w-full items-center justify-between p-4 text-left"
              >
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800">{topic.name}</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100">
                      <div className={`h-full rounded-full ${accentBg[subject.accent]}`} style={{ width: `${topic.weight}%` }} />
                    </div>
                    <span className={`text-xs font-semibold ${accentText[subject.accent]}`}>{topic.weight}% weightage</span>
                  </div>
                </div>
                {isOpen ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
              </button>
              {isOpen && (
                <div className="border-t border-slate-100 p-4">
                  {relatedNotes.length > 0 ? (
                    <div className="space-y-2">
                      {relatedNotes.map((note) => (
                        <Link
                          key={note.id}
                          to={`/notes/${subject.id}?topic=${encodeURIComponent(topic.name)}`}
                          className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                        >
                          <BookOpen size={14} className={accentText[subject.accent]} /> {note.title}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">No notes added yet for this topic — add some from Admin.</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}