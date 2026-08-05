import React, { useState } from "react";
import { SUBJECTS } from "../data/subjects";
import { addQuestionsToPool, getPoolCount } from "../lib/adminTests";
import { parseBulkText, ParseResult } from "../lib/bulkImport";
import { getAdminTestsLocal, saveAdminTestsLocal, getCustomNotes, addCustomNote, deleteCustomNote } from "../lib/storage";
import { Question, AdminTest, NoteEntry } from "../types";
import { ShieldCheck, Trash2, Upload, BookOpen, Smartphone } from "lucide-react";

function blankQuestion() {
  return { text: "", options: ["", "", "", ""], answer: 0, topic: "" };
}

export default function AdminPanel() {
  const [subjectId, setSubjectId] = useState(SUBJECTS[0].id);
  const [q, setQ] = useState(blankQuestion());
  const [poolCounts, setPoolCounts] = useState<Record<string, number>>(
    Object.fromEntries(SUBJECTS.map((s) => [s.id, getPoolCount(s.id)]))
  );

  const currentSubject = SUBJECTS.find((s) => s.id === subjectId)!;

  function updateOption(oi: number, val: string) {
    setQ((prev) => ({ ...prev, options: prev.options.map((o, i) => (i === oi ? val : o)) }));
  }

  function addQuestion() {
    if (!q.text.trim() || !q.topic || q.options.some((o) => !o.trim())) {
      alert("Fill in the question text, pick a topic, and fill all 4 options before adding.");
      return;
    }
    const question: Question = {
      id: `admin-${Date.now()}`,
      text: q.text,
      options: q.options,
      answer: q.answer,
      topic: q.topic,
      source: "Admin Created",
    };
    const created = addQuestionsToPool(subjectId, [question]);
    setPoolCounts((prev) => ({ ...prev, [subjectId]: getPoolCount(subjectId) }));
    setQ(blankQuestion());
    if (created > 0) {
      alert(`25 questions reached! "${currentSubject.short} Practice Test ${created}" was created automatically. Find it under Tests → My Created Tests.`);
    }
  }

  const [bulkText, setBulkText] = useState("");
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);

  function handleParse() {
    setParseResult(parseBulkText(bulkText));
  }

  function addParsedToPool() {
    if (!parseResult || parseResult.questions.length === 0) return;
    const created = addQuestionsToPool(subjectId, parseResult.questions);
    setPoolCounts((prev) => ({ ...prev, [subjectId]: getPoolCount(subjectId) }));
    setBulkText("");
    setParseResult(null);
    if (created > 0) {
      alert(`${created} new test(s) created for ${currentSubject.short} from this batch. Check Tests → My Created Tests.`);
    }
  }

  const [adminTests, setAdminTests] = useState<AdminTest[]>(getAdminTestsLocal());

  function deleteTest(id: string) {
    const next = adminTests.filter((t) => t.id !== id);
    setAdminTests(next);
    saveAdminTestsLocal(next);
  }

  const [customNotes, setCustomNotes] = useState<NoteEntry[]>(getCustomNotes());
  const [noteSubject, setNoteSubject] = useState(SUBJECTS[0].short);
  const [noteTopic, setNoteTopic] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [noteBody, setNoteBody] = useState("");
  const topicsForNoteSubject = SUBJECTS.find((s) => s.short === noteSubject)?.topics || [];

  function saveNote() {
    if (!noteTitle.trim() || !noteBody.trim() || !noteTopic) {
      alert("Please fill in Subject, Topic, Title, and Body before saving.");
      return;
    }
    const note: NoteEntry = { id: `note-${Date.now()}`, subject: noteSubject, topic: noteTopic, title: noteTitle, body: noteBody };
    setCustomNotes(addCustomNote(note));
    setNoteTitle("");
    setNoteBody("");
    setNoteTopic("");
    alert(`Note "${note.title}" saved under ${note.subject} → ${note.topic}.`);
  }

  function removeNote(id: string) {
    setCustomNotes(deleteCustomNote(id));
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center gap-2">
        <ShieldCheck className="text-pink-500" size={22} />
        <div>
          <h1 className="text-2xl font-bold text-slate-800" style={{ fontFamily: "Sora" }}>My Content</h1>
          <p className="text-sm text-slate-500">Add your own questions and notes — organized automatically into tests.</p>
        </div>
      </div>

      <div className="mb-6 flex items-start gap-3 rounded-2xl border border-sky-200 bg-sky-50 p-4">
        <Smartphone className="mt-0.5 shrink-0 text-sky-500" size={20} />
        <div>
          <p className="text-sm font-semibold text-slate-800">This content is private to your device</p>
          <p className="mt-1 text-xs text-slate-500">
            Saved only in this browser — not visible to anyone else, and won't appear on a different phone or computer.
          </p>
        </div>
      </div>

      <div className="mb-4 rounded-2xl border border-pink-200 bg-pink-50/40 p-4">
        <label className="mb-1 block text-xs font-semibold text-slate-500">Adding to Subject</label>
        <select
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold focus:border-pink-400 focus:outline-none"
        >
          {SUBJECTS.map((s) => <option key={s.id} value={s.id}>{s.short}</option>)}
        </select>
        <p className="mt-2 text-xs text-slate-500">
          <strong>{poolCounts[subjectId] || 0} / 25</strong> questions toward the next auto-created test for {currentSubject.short}
        </p>
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
          <div className="h-full rounded-full bg-pink-500" style={{ width: `${((poolCounts[subjectId] || 0) / 25) * 100}%` }} />
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-pink-200 bg-white p-5 shadow-sm">
        <h3 className="mb-3 text-sm font-bold text-slate-800" style={{ fontFamily: "Sora" }}>Add a Question</h3>
        <input
          value={q.text}
          onChange={(e) => setQ((p) => ({ ...p, text: e.target.value }))}
          placeholder="Question text"
          className="mb-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-pink-400 focus:outline-none"
        />
        <select
          value={q.topic}
          onChange={(e) => setQ((p) => ({ ...p, topic: e.target.value }))}
          className="mb-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-pink-400 focus:outline-none"
        >
          <option value="">Select topic...</option>
          {currentSubject.topics.map((t) => <option key={t.name} value={t.name}>{t.name}</option>)}
        </select>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {q.options.map((opt, oi) => (
            <label
              key={oi}
              className={`flex items-center gap-2 rounded-lg border px-2 py-1.5 text-xs ${q.answer === oi ? "border-yellow-400 bg-yellow-50" : "border-slate-200"}`}
            >
              <input
                type="radio"
                name="correct"
                checked={q.answer === oi}
                onChange={() => setQ((p) => ({ ...p, answer: oi }))}
                className="accent-pink-500"
              />
              <input
                value={opt}
                onChange={(e) => updateOption(oi, e.target.value)}
                placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                className="w-full bg-transparent text-xs focus:outline-none"
              />
            </label>
          ))}
        </div>
        <button onClick={addQuestion} className="mt-3 rounded-lg bg-pink-500 px-4 py-2 text-xs font-bold text-white">
          Add Question
        </button>
      </div>

      <div className="mb-6 rounded-2xl border border-sky-200 bg-sky-50/40 p-5">
        <div className="mb-3 flex items-center gap-2">
          <Upload className="text-sky-500" size={18} />
          <h3 className="text-sm font-bold text-slate-800" style={{ fontFamily: "Sora" }}>Bulk Import to {currentSubject.short}</h3>
        </div>
        <pre className="mb-3 overflow-x-auto rounded-lg bg-slate-900 p-3 text-[11px] text-slate-300">
{`Q: What is the capital of Telangana?
A) Warangal
B) Hyderabad
C) Karimnagar
D) Nizamabad
Correct: B
Topic: Geography of India`}
        </pre>
        <textarea
          value={bulkText}
          onChange={(e) => setBulkText(e.target.value)}
          placeholder="Paste your questions here..."
          rows={8}
          className="mb-3 w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-sm focus:border-sky-400 focus:outline-none"
        />
        <button onClick={handleParse} className="rounded-lg bg-sky-500 px-4 py-2 text-xs font-bold text-white">Parse Questions</button>
        {parseResult && (
          <div className="mt-4">
            <p className="mb-2 text-xs font-semibold text-slate-700">
              Parsed {parseResult.questions.length} question(s){parseResult.errors.length > 0 && `, ${parseResult.errors.length} skipped`}
            </p>
            {parseResult.errors.map((err, i) => <p key={i} className="text-[11px] text-rose-500">{err}</p>)}
            {parseResult.questions.length > 0 && (
              <button onClick={addParsedToPool} className="mt-2 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-bold text-white">
                Add {parseResult.questions.length} Question(s) to {currentSubject.short}
              </button>
            )}
          </div>
        )}
      </div>

      {adminTests.length > 0 && (
        <div className="mb-10">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">Your Auto-Created Tests</h3>
          <div className="space-y-2">
            {adminTests.map((t) => (
              <div key={t.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{t.title}</p>
                  <p className="text-[11px] text-slate-400">{t.questions.length} Qs · {t.duration} min</p>
                </div>
                <button onClick={() => deleteTest(t.id)} className="text-slate-300 hover:text-rose-500"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4">
        <div className="mb-4 flex items-center gap-2">
          <BookOpen className="text-sky-500" size={20} />
          <h2 className="text-xl font-bold text-slate-800" style={{ fontFamily: "Sora" }}>Add a Note</h2>
        </div>
        <div className="mb-6 rounded-2xl border border-sky-200 bg-sky-50/40 p-5">
          <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">Subject</label>
              <select
                value={noteSubject}
                onChange={(e) => { setNoteSubject(e.target.value); setNoteTopic(""); }}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none"
              >
                {SUBJECTS.map((s) => <option key={s.id} value={s.short}>{s.short}</option>)}
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
                {topicsForNoteSubject.map((t) => <option key={t.name} value={t.name}>{t.name}</option>)}
              </select>
            </div>
          </div>
          <input
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            placeholder="Note title"
            className="mb-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none"
          />
          <textarea
            value={noteBody}
            onChange={(e) => setNoteBody(e.target.value)}
            placeholder="Note content..."
            rows={6}
            className="mb-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none"
          />
          <button onClick={saveNote} className="rounded-lg bg-sky-500 px-4 py-2 text-xs font-bold text-white">Save Note</button>
        </div>

        {customNotes.length > 0 && (
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">Your Added Notes</h3>
            <div className="space-y-2">
              {customNotes.map((n) => (
                <div key={n.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{n.title}</p>
                    <p className="text-[11px] text-slate-400">{n.subject} · {n.topic}</p>
                  </div>
                  <button onClick={() => removeNote(n.id)} className="text-slate-300 hover:text-rose-500"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}