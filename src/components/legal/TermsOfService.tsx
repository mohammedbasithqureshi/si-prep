import React from "react";
import LegalLayout from "./LegalLayout";

export default function TermsOfService() {
  return (
    <LegalLayout title="Terms of Service" lastUpdated="August 2026">
      <p>By using SI Prep, you agree to the following terms.</p>

      <h2 className="text-base font-bold text-slate-800">Nature of the Service</h2>
      <p>SI Prep is an independent, unofficial exam preparation resource for the Telangana Police Sub-Inspector (TS SI) recruitment exam. It is not affiliated with, endorsed by, or connected to the Telangana State Level Police Recruitment Board (TSLPRB), the Government of Telangana, or any government body.</p>

      <h2 className="text-base font-bold text-slate-800">Accuracy of Content</h2>
      <p>Mock test questions, syllabus weightage estimates, notes, and exam dates on this site are provided for practice purposes only and may contain errors or become outdated. Weightage percentages shown are estimates based on informal analysis of previous papers, not official TSLPRB figures. Always verify exam patterns, syllabus, and dates against the official TSLPRB notification and website before relying on them for your preparation.</p>

      <h2 className="text-base font-bold text-slate-800">No Guarantee of Results</h2>
      <p>Use of this site does not guarantee any particular exam outcome, score, or selection result.</p>

      <h2 className="text-base font-bold text-slate-800">User-Generated Content</h2>
      <p>Any tests or notes you create using the Admin tools are stored locally in your browser and are your own responsibility — we do not review, moderate, or guarantee the accuracy of self-created content.</p>

      <h2 className="text-base font-bold text-slate-800">Acceptable Use</h2>
      <p>You agree not to use this site for any unlawful purpose or in a way that could damage, disable, or impair the site.</p>

      <h2 className="text-base font-bold text-slate-800">Changes to the Service</h2>
      <p>Features, content, and availability of this site may change or be discontinued at any time without notice.</p>

      <h2 className="text-base font-bold text-slate-800">Limitation of Liability</h2>
      <p>This site is provided "as is" without warranties of any kind. We are not liable for any loss or damage arising from your use of, or inability to use, this site.</p>
    </LegalLayout>
  );
}