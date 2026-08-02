import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Sparkles, ShieldCheck, Star, TrendingUp } from "lucide-react";

const tabs = [
  { path: "/", label: "Tests", icon: LayoutDashboard },
  { path: "/flashcards", label: "Cards", icon: Sparkles },
  { path: "/bookmarks", label: "Saved", icon: Star },
  { path: "/progress", label: "Progress", icon: TrendingUp },
  { path: "/admin", label: "Admin", icon: ShieldCheck },
];

export default function NavHeader() {
  const { pathname } = useLocation();

  return (
    <>
      {/* Desktop top bar */}
      <div className="sticky top-0 z-20 hidden border-b border-sky-100 bg-white/90 backdrop-blur sm:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500 font-bold text-white">SI</div>
            <span className="font-bold text-slate-800">SI Prep</span>
          </div>
          <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
            {tabs.map((t) => {
              const Icon = t.icon;
              const active = pathname === t.path;
              return (
                <Link
                  key={t.path}
                  to={t.path}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${active ? "bg-white text-sky-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                  <Icon size={14} /> {t.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile top brand bar */}
      <div className="sticky top-0 z-20 flex items-center justify-center border-b border-sky-100 bg-white/90 px-4 py-2.5 backdrop-blur sm:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500 text-xs font-bold text-white">SI</div>
          <span className="text-sm font-bold text-slate-800">SI Prep</span>
        </div>
      </div>

      {/* Mobile bottom tab bar */}
      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-sky-100 bg-white/95 backdrop-blur sm:hidden">
        <div className="flex items-center justify-around px-1 py-1.5" style={{ paddingBottom: "max(0.375rem, env(safe-area-inset-bottom))" }}>
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = pathname === t.path;
            return (
              <Link
                key={t.path}
                to={t.path}
                className={`flex flex-1 flex-col items-center gap-0.5 rounded-lg py-1.5 text-[10px] font-semibold transition ${active ? "text-sky-600" : "text-slate-400"}`}
              >
                <Icon size={20} className={active ? "text-sky-600" : "text-slate-400"} />
                {t.label}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}