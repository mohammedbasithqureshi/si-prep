import React, { useState } from "react";
import {
  getAdminTestsLocal,
  saveAdminTestsLocal,
  getCustomNotes,
  addCustomNote,
  deleteCustomNote,
} from "../lib/storage";
import { AdminTest, Question } from "../types";
import { NoteEntry } from "../data/notes";
import { SUBJECTS } from "../data/subjects";
import { ShieldCheck, Plus, Trash2, BookOpen } from "lucide-react";

function blankQuestion(): Question {
  return { id: "", text: "", options: ["", "", "", ""], answer: 0, topic: "", source: "Admin Created" };
}

export default function AdminPanel() {
  // Mock Test State
  const [adminTests, setAdminTests] = useState<AdminTest[]>(getAdminTestsLocal());
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(20);
  const [questions, setQuestions] = useState<Question[]>([blankQuestion()]);

  // Notes State
  const [customNotes, setCustomNotes] = useState<NoteEntry[]>(getCustomNotes());
  const [noteSubject, setNoteSubject] = useState(SUBJECTS[0]?.short || "");
  const [noteTopic, setNoteTopic] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [noteBody, setNoteBody] = useState("");

  const topicsForSubject = SUBJECTS.find((s) => s.short === noteSubject)?.topics || [];

  // Mock Test Helpers
  function persist(tests: AdminTest[]) {
    setAdminTests(tests);
    saveAdminTestsLocal(tests);
  }

  function updateQ(i: number, patch: Partial<Question>) {
    setQuestions((qs) => qs.map((q, idx) => (idx === i ? { ...q, ...patch } : q)));
  }

  function updateOption(i: number, oi: number, val: string) {
    setQuestions((qs) =>
      qs.map((q, idx) => (idx === i ? { ...q, options: q.options.map((o, j) => (j === oi ? val : o)) } : q))
    );
  }

  function addQuestion() {
    setQuestions((qs) => [...qs, blankQuestion()]);
  }

  function removeQuestion(i: number) {
    setQuestions((qs) => qs.filter((_, idx) => idx !== i));
  }

  function saveTest() {
    if (!title.trim()) return;
    const clean = questions
      .filter((q) => q.text.trim())
      .map((q, i) => ({ ...q, id: `admin-${Date.now()}-${i}` }));
    if (clean.length === 0) return;
    const next = [...adminTests, { id: `test-${Date.now()}`, title, duration: Number(duration), questions: clean }];
    persist(next);
    setTitle("");
    setDuration(20);
    setQuestions([blankQuestion()]);
  }

  function deleteTest(i: number) {
    persist(adminTests.filter((_, idx) => idx !== i));
  }

  // Notes Helpers
  function saveNote() {
    if (!noteTitle.trim() || !noteBody.trim() || !noteTopic) return;
    const note: NoteEntry = {
      id: `note-${Date.now()}`,
      subject: noteSubject,
      topic: noteTopic,
      title: noteTitle,
      body: noteBody,
    };
    setCustomNotes(addCustomNote(note));
    setNoteTitle("");
    setNoteBody("");
    setNoteTopic("");
  }

  function removeNote(id: string) {
    setCustomNotes(deleteCustomNote(id));
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* SECTION 1: Mock Test Builder */}
      <div className="mb-6 flex items-center gap-2">
        <ShieldCheck className="text-pink-500" size={22} />
        <div>
          <h1 className="text-2xl font-bold text-slate-800" style={{ fontFamily: "Sora" }}>
            Admin — Create Mock Test
          </h1>
          <p className="text-sm text-slate-500">Questions here are personal — not from the internet.</p>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-pink-200 bg-pink-50/40 p-5">
        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold text-slate-500">Test Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. My Weak Topics Revision Test"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-pink-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">Duration (min)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-pink-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-4">
          {questions.map((q, i) => (
            <div key={i} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-bold text-pink-600">Q{i + 1}</span>
                {questions.length > 1 && (
                  <button onClick={() => removeQuestion(i)} className="text-slate-300 hover:text-rose-500">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              <input
                value={q.text}
                onChange={(e) => updateQ(i, { text: e.target.value })}
                placeholder="Question text"
                className="mb-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-pink-400 focus:outline-none"
              />
              <input
                value={q.topic}
                onChange={(e) => updateQ(i, { topic: e.target.value })}
                placeholder="Topic"
                className="mb-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-pink-400 focus:outline-none"
              />
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {q.options.map((opt, oi) => (
                  <label
                    key={oi}
                    className={`flex items-center gap-2 rounded-lg border px-2 py-1.5 text-xs ${
                      q.answer === oi ? "border-yellow-400 bg-yellow-50" : "border-slate-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`correct-${i}`}
                      checked={q.answer === oi}
                      onChange={() => updateQ(i, { answer: oi })}
                      className="accent-pink-500"
                    />
                    <input
                      value={opt}
                      onChange={(e) => updateOption(i, oi, e.target.value)}
                      placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                      className="w-full bg-transparent text-xs focus:outline-none"
                    />
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={addQuestion}
            className="flex items-center gap-1.5 rounded-lg border border-pink-300 bg-white px-3 py-2 text-xs font-semibold text-pink-600"
          >
            <Plus size={14} /> Add Question
          </button>
          <button onClick={saveTest} className="rounded-lg bg-pink-500 px-4 py-2 text-xs font-bold text-white">
            Save Test
          </button>
        </div>
      </div>

      {adminTests.length > 0 && (
        <div className="mb-10">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">Saved Admin Tests</h3>
          <div className="space-y-2">
            {adminTests.map((t, i) => (
              <div
                key={t.id}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-800">{t.title}</p>
                  <p className="text-[11px] text-slate-400">
                    {t.questions.length} Qs · {t.duration} min
                  </p>
                </div>
                <button onClick={() => deleteTest(i)} className="text-slate-300 hover:text-rose-500">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: Create Note */}
      <div className="mt-10">
        <div className="mb-4 flex items-center gap-2">
          <BookOpen className="text-sky-500" size={20} />
          <h2 className="text-xl font-bold text-slate-800" style={{ fontFamily: "Sora" }}>
            Add a Note
          </h2>
        </div>

        <div className="mb-6 rounded-2xl border border-sky-200 bg-sky-50/40 p-5">
          <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">Subject</label>
              <select
                value={noteSubject}
                onChange={(e) => {
                  setNoteSubject(e.target.value);
                  setNoteTopic("");
                }}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none"
              >
                {SUBJECTS.map((s) => (
                  <option key={s.id} value={s.short}>
                    {s.short}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">Topic</label>
              <select
                value={noteTopic}
                onChange={(e) => setNoteTopic(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none"
              >
                <option value="">Select topic...</option>
                {topicsForSubject.map((t) => (
                  <option key={t.name} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <input
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            placeholder="Note title (e.g. Simple Interest Formula)"
            className="mb-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none"
          />
          <textarea
            value={noteBody}
            onChange={(e) => setNoteBody(e.target.value)}
            placeholder={
              "Write the note content here.\n\nUse a blank line to start a new paragraph.\nStart a line with \"- \" for a bullet point."
            }
            rows={6}
            className="mb-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none"
          />
          <button onClick={saveNote} className="rounded-lg bg-sky-500 px-4 py-2 text-xs font-bold text-white">
            Save Note
          </button>
        </div>

        {customNotes.length > 0 && (
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">Your Added Notes</h3>
            <div className="space-y-2">
              {customNotes.map((n) => (
                <div
                  key={n.id}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{n.title}</p>
                    <p className="text-[11px] text-slate-400">
                      {n.subject} · {n.topic}
                    </p>
                  </div>
                  <button onClick={() => removeNote(n.id)} className="text-slate-300 hover:text-rose-500">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}