import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import NavHeader from "./components/NavHeader";
import Dashboard from "./components/Dashboard";
import Flashcards from "./components/Flashcards";
import AdminPanel from "./components/AdminPanel";
import TestRunner from "./components/TestRunner";
import Results from "./components/Results";
import Login from "./components/Login";
import { checkSession } from "./lib/api";

export default function App() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => { checkSession().then(setAuthed); }, []);

  if (authed === null) return <div className="flex min-h-screen items-center justify-center bg-sky-50 text-slate-400">Loading...</div>;
  if (!authed) return <Login onSuccess={() => setAuthed(true)} />;

  const hideNav = location.pathname.startsWith("/test/");
  return (
    <AppProvider>
      <div className="min-h-screen bg-sky-50">
        {!hideNav && <NavHeader />}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/test/:testId" element={<TestRunner />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </div>
    </AppProvider>
  );
}