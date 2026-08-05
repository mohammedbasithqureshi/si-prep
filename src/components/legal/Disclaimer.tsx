import React from "react";
import LegalLayout from "./LegalLayout";

export default function Disclaimer() {
  return (
    <LegalLayout title="Disclaimer" lastUpdated="August 2026">
      <h2 className="text-base font-bold text-slate-800">Not an Official Source</h2>
      <p>SI Prep is an independently built study aid and is not affiliated with the Telangana State Level Police Recruitment Board (TSLPRB) or any government authority. For official notifications, syllabus, exam dates, and results, always refer to the official TSLPRB website (tslprb.in).</p>

      <h2 className="text-base font-bold text-slate-800">Content Accuracy</h2>
      <p>Questions marked "Old Paper" are recreated based on general recollection of past exam patterns and may not be verbatim reproductions of official question papers. Questions marked "Predicted" are original practice questions written to match likely exam patterns and are not official or leaked exam content. Current-affairs content is pulled from public news RSS feeds and reflects those sources' reporting, not an official government position.</p>

      <h2 className="text-base font-bold text-slate-800">Exam Date and Pattern</h2>
      <p>Exam dates, patterns, and cutoffs referenced on this site are based on publicly available information at the time of writing and are subject to change by TSLPRB without notice to us.</p>
    </LegalLayout>
  );
}