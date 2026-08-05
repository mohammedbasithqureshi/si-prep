import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-12 border-t border-slate-200 bg-white/70 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <img
              src="/web-app-manifest-512x512.png"
              alt="SI Prep"
              className="h-7 w-7 rounded-lg"
            />
            <span className="text-sm font-bold text-slate-700">SI Prep</span>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-500">
            <Link to="/privacy-policy" className="hover:text-slate-700">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-slate-700">Terms of Service</Link>
            <Link to="/disclaimer" className="hover:text-slate-700">Disclaimer</Link>
            <Link to="/contact" className="hover:text-slate-700">Contact</Link>
          </nav>
        </div>
        <p className="mt-6 text-center text-[11px] text-slate-400">
          © {year} SI Prep. An independent exam preparation resource — not affiliated with TSLPRB or the Government of Telangana.
        </p>
      </div>
    </footer>
  );
}