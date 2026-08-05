import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function LegalLayout({ title, lastUpdated, children }: { title: string; lastUpdated: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link to="/" className="mb-6 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>
      <h1 className="mb-1 text-2xl font-bold text-slate-800" style={{ fontFamily: "Sora" }}>{title}</h1>
      <p className="mb-6 text-xs text-slate-400">Last updated: {lastUpdated}</p>
      <div className="prose prose-sm max-w-none space-y-4 text-sm leading-relaxed text-slate-600">
        {children}
      </div>
    </div>
  );
}