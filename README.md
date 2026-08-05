# SI Prep — TS Police SI 2026 Exam Preparation

A personal, all-in-one exam prep tool for the Telangana Police Sub-Inspector (TS SI) 2026 recruitment exam. Built with Vite + React + TypeScript + Tailwind, deployed on Vercel.

## Features

- **Mock Tests** — combined full-length simulation, per-paper practice (Reasoning, General Studies, English, Telugu), rule-based generated question sets, and a mistakes-review deck that tracks what you've gotten wrong
- **Practice vs Exam Mode** — instant right/wrong feedback while studying, or a blind real-exam simulation
- **Randomized Attempts** — question and option order shuffle on every retake
- **Flashcards** — important concepts plus live current-affairs headlines pulled from RSS feeds
- **Syllabus & Notes** — full topic breakdown per subject with weightage estimates and study notes
- **Bookmarks** — star any question or flashcard, view them all in one place
- **Progress Analytics** — accuracy trends, focus-area recommendations (weightage × weakness), streak tracking
- **Admin Panel** — create your own mock tests and notes manually, or bulk-import questions by pasting formatted text
- **Daily Reminders** — browser notifications while the tab is open
- **Offline Support (PWA)** — installable, works without a connection for anything not requiring live data
- **Legal Pages** — Privacy Policy, Terms of Service, Disclaimer, Contact

## Tech Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS, React Router
- **Backend:** Vercel Serverless Functions (`/api`) — currently the current-affairs RSS scraper
- **Storage:** Browser `localStorage` — single-user personal tool, no database or accounts
- **Deployment:** Vercel, auto-deploys on push to `main`

## Project Structure
si-prep/
├── api/
│ └── current-affairs.ts # RSS feed scraper (PIB + Times of India)
├── src/
│ ├── data/
│ │ ├── subjects/ # Questions + syllabus weightage, one file per subject
│ │ └── notes/ # Study notes, one file per subject
│ ├── lib/
│ │ ├── storage.ts # All localStorage read/write logic
│ │ ├── predictor.ts # Rule-based question generator (Reasoning only)
│ │ ├── caQuizGenerator.ts # Builds quiz questions from live current-affairs headlines
│ │ ├── bulkImport.ts # Parses pasted text into questions (Admin panel)
│ │ ├── shuffle.ts # Randomizes question/option order per attempt
│ │ ├── analysis.ts # Focus-areas and weakest-topic logic
│ │ ├── examDate.ts # Exam countdown (update EXAM_DATE once TSLPRB announces it)
│ │ └── notifications.ts # Daily reminder browser notifications
│ ├── components/ # One component per screen/feature
│ │ └── legal/ # Privacy, Terms, Disclaimer, Contact pages
│ ├── context/ # AppContext (streak), ThemeContext (dark mode)
│ └── App.tsx # Routes
└── vite.config.ts
## Local Development

```bash
npm install
npm run dev          # frontend only — /api routes won't work
vercel dev           # frontend + /api routes together, needed to test current affairs
```

## Adding Content

**New questions:** open `src/data/subjects/<subject>.ts`, add an entry to the `questions` array.

**New notes:** open `src/data/notes/<subject>.ts`, add an entry — or use the Admin panel's "Add a Note" form.

**Bulk questions:** Admin → Bulk Import, paste in this format (blank line between questions):
Q: What is the capital of Telangana?
A) Warangal
B) Hyderabad
C) Karimnagar
D) Nizamabad
Correct: B
Topic: Geography of India


## Known Limitations

- The rule-based question generator only covers 5 Reasoning topics with real formulas — GS/English/Telugu need manually written or bulk-imported content.
- The exam date in `examDate.ts` is `null` until TSLPRB officially announces the Preliminary Written Test date.
- Single-user by design — no accounts, no shared data.

## Deployment

Connected to Vercel via GitHub — every push to `main` auto-deploys. Feature branches get their own preview URL automatically.