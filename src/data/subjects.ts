import { Subject } from "../types";

export const SUBJECTS: Subject[] = [
  {
    id: "reasoning", name: "Reasoning & Mental Ability", short: "Reasoning", accent: "sky", duration: 30,
    topics: [
      { name: "Number Series & Simplification", weight: 20 },
      { name: "Analogies & Similarities", weight: 16 },
      { name: "Time, Work & Wages", weight: 14 },
      { name: "Percentage, Profit & Loss", weight: 14 },
      { name: "Averages & Partnership", weight: 12 },
      { name: "Spatial & Visual Reasoning", weight: 12 },
      { name: "Clocks, Calendars & Mensuration", weight: 12 },
    ],
    questions: [
      { id: "r1", text: "A sum of ₹8,000 amounts to ₹9,800 in 3 years at simple interest. What is the rate of interest per annum?", options: ["6.5%", "7.5%", "8%", "9%"], answer: 1, topic: "Percentage, Profit & Loss", source: "Old Paper" },
      { id: "r2", text: "Find the next number in the series: 5, 11, 23, 47, ?", options: ["93", "94", "95", "96"], answer: 2, topic: "Number Series & Simplification", source: "Predicted" },
      { id: "r3", text: "A can finish a work in 18 days and B in 24 days. Together, how many days?", options: ["9 5/7", "10 2/7", "12", "14"], answer: 0, topic: "Time, Work & Wages", source: "Old Paper" },
    ],
  },
  {
    id: "gs", name: "General Studies", short: "General Studies", accent: "yellow", duration: 30,
    topics: [
      { name: "Current Affairs (National & Int'l)", weight: 22 },
      { name: "Telangana Movement & State Formation", weight: 20 },
      { name: "Indian Polity & Economy", weight: 18 },
      { name: "Geography of India", weight: 14 },
      { name: "History of India", weight: 14 },
      { name: "General Science", weight: 12 },
    ],
    questions: [
      { id: "g1", text: "'Mission Bhagiratha' was launched in which state?", options: ["Andhra Pradesh", "Telangana", "Karnataka", "Tamil Nadu"], answer: 1, topic: "Telangana Movement & State Formation", source: "Old Paper" },
      { id: "g2", text: "Which Article of the Constitution abolishes untouchability?", options: ["Article 15", "Article 17", "Article 21", "Article 25"], answer: 1, topic: "Indian Polity & Economy", source: "Old Paper" },
    ],
  },
  {
    id: "english", name: "English", short: "English", accent: "pink", duration: 20,
    topics: [
      { name: "Reading Comprehension", weight: 30 },
      { name: "Grammar & Error Spotting", weight: 26 },
      { name: "Vocabulary & Synonyms", weight: 22 },
      { name: "Letter / Essay / Report Writing", weight: 22 },
    ],
    questions: [
      { id: "e1", text: "Choose the correctly spelled word.", options: ["Occassion", "Occasion", "Ocassion", "Occession"], answer: 1, topic: "Vocabulary & Synonyms", source: "Old Paper" },
    ],
  },
  {
    id: "telugu", name: "Telugu", short: "Telugu", accent: "yellow", duration: 20,
    topics: [
      { name: "వ్యాకరణం (Grammar)", weight: 30 },
      { name: "గద్యం-పద్యం అవగాహన (Comprehension)", weight: 28 },
      { name: "పర్యాయపదాలు (Synonyms)", weight: 22 },
      { name: "లేఖ / వ్యాస రచన (Letter/Essay)", weight: 20 },
    ],
    questions: [
      { id: "t1", text: "'నేను పాఠశాలకు వెళ్తాను' వాక్యంలో క్రియా పదం ఏది?", options: ["నేను", "పాఠశాలకు", "వెళ్తాను", "ఏదీ కాదు"], answer: 2, topic: "వ్యాకరణం (Grammar)", source: "Old Paper" },
    ],
  },
];

export const CUTOFF = { OC: 40, BC: 35, SC_ST: 30 };