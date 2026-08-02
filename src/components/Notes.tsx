import React, { useState, useMemo } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { NOTES } from "../data/notes";
import { SUBJECTS } from "../data/subjects";
import { ArrowLeft, Search } from "lucide-react";
import { getCustomNotes } from "../lib/storage";

export default function Notes() {
  const { subjectId } = useParams();
  const [searchParams] = useSearchParams();
  const topicFilter = searchParams.get("topic");
  const subject = SUBJECTS.find((s) => s.id === subjectId);
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const allNotes = useMemo(() => [...NOTES, ...getCustomNotes()], []);

  const notes = useMemo(() => {
    let list = allNotes.filter((n) => n.subject === subject?.short);
    if (topicFilter) list = list.filter((n) => n.topic === topicFilter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (n) => n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q)
      );
    }
    return list;
  }, [allNotes, subject, topicFilter, query]);

  if (!subject) return <p className="p-8 text-center text-slate-400">Subject not found.</p>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        to={`/syllabus/${subject.id}`}
        className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft size={16} /> Back to Syllabus
      </Link>
      <h1 className="mb-4 text-2xl font-bold text-slate-800" style={{ fontFamily: "Sora" }}>
        {subject.short} Notes
      </h1>

      <div className="mb-6 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
        <Search size={16} className="text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search notes..."
          className="w-full text-sm focus:outline-none"
        />
      </div>

      {notes.length === 0 && (
        <p className="py-10 text-center text-sm text-slate-400">No notes match yet.</p>
      )}

      <div className="space-y-3">
        {notes.map((note) => {
          const isOpen = openId === note.id;
          return (
            <div key={note.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <button
                onClick={() => setOpenId(isOpen ? null : note.id)}
                className="w-full p-4 text-left"
              >
                <p className="text-sm font-semibold text-slate-800">{note.title}</p>
                <p className="mt-0.5 text-xs text-slate-400">{note.topic}</p>
              </button>
              {isOpen && (
                <div className="border-t border-slate-100 p-4 text-sm leading-relaxed text-slate-600">
                  {note.body.split("\n\n").map((para, i) => (
                    <div key={i} className="mb-3">
                      {para.split("\n").map((line, j) =>
                        line.trim().startsWith("- ") ? (
                          <p key={j} className="ml-3 before:mr-2 before:content-['•']">
                            {line.replace("- ", "")}
                          </p>
                        ) : (
                          <p key={j}>{line}</p>
                        )
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}