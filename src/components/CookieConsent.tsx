import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Cookie } from "lucide-react";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("siprep_cookie_consent");
    if (!consent) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem("siprep_cookie_consent", "accepted");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white p-4 shadow-lg sm:bottom-4 sm:left-4 sm:right-auto sm:max-w-md sm:rounded-2xl sm:border">
      <div className="flex items-start gap-3">
        <Cookie className="mt-0.5 shrink-0 text-sky-500" size={20} />
        <div>
          <p className="text-sm text-slate-700">
            This site uses local storage to save your progress, and may use cookies for ads/analytics in the future.
            See our <Link to="/privacy-policy" className="text-sky-600 underline">Privacy Policy</Link>.
          </p>
          <button onClick={accept} className="mt-3 rounded-lg bg-sky-500 px-4 py-2 text-xs font-bold text-white">
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}