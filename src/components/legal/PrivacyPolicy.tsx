import React from "react";
import LegalLayout from "./LegalLayout";

export default function PrivacyPolicy() {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="August 2026">
      <p>This Privacy Policy explains how SI Prep ("we", "this site") handles information when you use this website.</p>

      <h2 className="text-base font-bold text-slate-800">Information We Store</h2>
      <p>SI Prep stores your study data — mock test attempts, bookmarks, streak history, and reminder settings — directly in your browser's local storage. This data is not transmitted to or stored on any server we control, and is not accessible to us or any third party. Clearing your browser data will permanently delete this information.</p>

      <h2 className="text-base font-bold text-slate-800">Current Affairs Content</h2>
      <p>The Flashcards section fetches publicly available news headlines from third-party RSS feeds (such as the Press Information Bureau and Times of India) to display current-affairs content. This request does not include any personal information about you.</p>

      <h2 className="text-base font-bold text-slate-800">Advertising and Analytics</h2>
      <p>[If/when this site displays advertising via Google AdSense or uses Google Analytics, this section will describe: (a) that Google and its partners use cookies to serve ads based on prior visits, (b) that you can opt out of personalized advertising via Google's Ads Settings, and (c) a link to Google's own Privacy & Terms page. This placeholder should be replaced with accurate, specific language once AdSense/Analytics is actually integrated.]</p>

      <h2 className="text-base font-bold text-slate-800">Third-Party Links</h2>
      <p>This site may link to external sources (such as TSLPRB's official website or news articles) for reference. We are not responsible for the privacy practices of external sites.</p>

      <h2 className="text-base font-bold text-slate-800">Children's Privacy</h2>
      <p>This site is intended for exam aspirants generally aged 18 and above, consistent with eligibility requirements for the TS Police SI recruitment. We do not knowingly collect information from children.</p>

      <h2 className="text-base font-bold text-slate-800">Changes to This Policy</h2>
      <p>We may update this policy as the site evolves. Continued use of the site after changes constitutes acceptance of the revised policy.</p>

      <h2 className="text-base font-bold text-slate-800">Contact</h2>
      <p>For questions about this policy, use the contact details on our <a href="/contact" className="text-sky-600">Contact page</a>.</p>
    </LegalLayout>
  );
}