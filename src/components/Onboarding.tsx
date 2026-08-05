import React, { useState, useEffect } from "react";
import { X, Layers, Sparkles, TrendingUp, ShieldCheck } from "lucide-react";

const STEPS = [
  { icon: Layers, title: "Mock Tests", desc: "Practice combined or paper-wise tests, real exam pattern, instant or blind feedback modes." },
  { icon: Sparkles, title: "Flashcards", desc: "Key concepts plus live current-affairs — star anything important to save it." },
  { icon: TrendingUp, title: "Progress & Focus Areas", desc: "See your accuracy trends and exactly which topics need the most attention." },
  { icon: ShieldCheck, title: "Admin Panel", desc: "Add your own notes and questions any time — bulk import supported too." },
];

export default function Onboarding() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const seen = localStorage.getItem("siprep_onboarded");
    if (!seen) setVisible(true);
  }, []);

  function close() {
    localStorage.setItem("siprep_onboarded", "true");
    setVisible(false);
  }

  if (!visible) return null;

  const current = STEPS[step];
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex gap-1">
            {STEPS.map((_, i) => (
              <span key={i} className={`h-1.5 w-6 rounded-full ${i === step ? "bg-sky-500" : "bg-slate-200"}`} />
            ))}
          </div>
          <button onClick={close} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100">
          <Icon className="text-sky-500" size={28} />
        </div>
        <h2 className="mb-1 text-lg font-bold text-slate-800" style={{ fontFamily: "Sora" }}>{current.title}</h2>
        <p className="mb-6 text-sm text-slate-500">{current.desc}</p>
        <div className="flex gap-2">
          {step > 0 && (
            <button onClick={() => setStep((s) => s - 1)} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600">Back</button>
          )}
          {step < STEPS.length - 1 ? (
            <button onClick={() => setStep((s) => s + 1)} className="flex-1 rounded-xl bg-sky-500 py-2.5 text-sm font-bold text-white">Next</button>
          ) : (
            <button onClick={close} className="flex-1 rounded-xl bg-sky-500 py-2.5 text-sm font-bold text-white">Get Started</button>
          )}
        </div>
      </div>
    </div>
  );
}