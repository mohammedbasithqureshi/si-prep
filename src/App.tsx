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
import ProgressPage from "./components/Progress";
import Syllabus from "./components/Syllabus";
import Notes from "./components/Notes"
import Footer from "./components/Footer";
import PrivacyPolicy from "./components/legal/PrivacyPolicy";
import TermsOfService from "./components/legal/TermsOfService";
import Disclaimer from "./components/legal/Disclaimer";
import Contact from "./components/legal/Contact";

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
  <div className={!hideNav ? "pb-20 sm:pb-0" : ""}>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/flashcards" element={<Flashcards />} />
      <Route path="/bookmarks" element={<Bookmarks />} />
      <Route path="/progress" element={<ProgressPage />} />
      <Route path="/admin" element={<AdminPanel />} />
      <Route path="/test/:testId" element={<TestRunner />} />
      <Route path="/results" element={<Results />} />
      <Route path="/syllabus/:subjectId" element={<Syllabus />} />
      <Route path="/notes/:subjectId" element={<Notes />} /> 
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
<Route path="/terms-of-service" element={<TermsOfService />} />
<Route path="/disclaimer" element={<Disclaimer />} />
<Route path="/contact" element={<Contact />} />
    </Routes>
  </div>
  {!hideNav && <Footer />}
</div>
    </AppProvider>
  );
}