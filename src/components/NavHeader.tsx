import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Sparkles, ShieldCheck } from "lucide-react";

const tabs = [
  { path: "/", label: "Mock Tests", icon: LayoutDashboard },
  { path: "/flashcards", label: "Flashcards", icon: Sparkles },
  { path: "/admin", label: "Admin", icon: ShieldCheck },
];

export default function NavHeader() {
  const { pathname } = useLocation();
  return (
    <div className="sticky top-0 z-20 border-b border-sky-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500 font-bold text-white">SI</div>
          <span className="font-bold text-slate-800">SI Prep</span>
        </div>
        <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = pathname === t.path;
            return (
              <Link key={t.path} to={t.path} className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${active ? "bg-white text-sky-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                <Icon size={14} /> <span className="hidden sm:inline">{t.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}