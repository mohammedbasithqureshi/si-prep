import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import NavHeader from "./components/NavHeader";
import Dashboard from "./components/Dashboard";
import Flashcards from "./components/Flashcards";
import AdminPanel from "./components/AdminPanel";
import TestRunner from "./components/TestRunner";
import Results from "./components/Results";
import Bookmarks from "./components/Bookmarks";
import { startReminderWatcher } from "./lib/notifications";

export default function App() {
  const location = useLocation();
  const hideNav = location.pathname.startsWith("/test/");

  useEffect(() => {
    startReminderWatcher();
  }, []);

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
          <Route path="/bookmarks" element={<Bookmarks />} />
        </Routes>
      </div>
    </AppProvider>
  );
}