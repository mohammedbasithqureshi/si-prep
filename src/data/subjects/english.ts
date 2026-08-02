import { Subject } from "../../types";

export const english: Subject = {
  id: "english",
  name: "English",
  short: "English",
  accent: "pink",
  duration: 20,
  topics: [
    { name: "Reading Comprehension", weight: 30 },
    { name: "Grammar & Error Spotting", weight: 26 },
    { name: "Vocabulary & Synonyms", weight: 22 },
    { name: "Letter / Essay / Report Writing", weight: 22 },
  ],
  questions: [
    { id: "e1", text: "Choose the correctly spelled word.", options: ["Occassion", "Occasion", "Ocassion", "Occession"], answer: 1, topic: "Vocabulary & Synonyms", source: "Old Paper" },
    { id: "e2", text: "Identify the error: 'Neither of the candidates were qualified for the post.'", options: ["Neither", "of the candidates", "were", "for the post"], answer: 2, topic: "Grammar & Error Spotting", source: "Predicted" },
    { id: "e3", text: "Choose the word closest in meaning to 'Diligent'.", options: ["Lazy", "Hardworking", "Careless", "Angry"], answer: 1, topic: "Vocabulary & Synonyms", source: "Old Paper" },
    { id: "e4", text: "Fill in the blank: 'The officer ____ the suspect for over an hour before he confessed.'", options: ["interrogate", "interrogated", "was interrogate", "interrogating"], answer: 1, topic: "Grammar & Error Spotting", source: "Predicted" },
    { id: "e5", text: "Choose the antonym of 'Frugal'.", options: ["Thrifty", "Wasteful", "Careful", "Modest"], answer: 1, topic: "Vocabulary & Synonyms", source: "Old Paper" },
    { id: "e6", text: "Identify the error: 'Each of the students have submitted their assignment.'", options: ["Each of the students", "have submitted", "their assignment", "No error"], answer: 1, topic: "Grammar & Error Spotting", source: "Old Paper" },
    { id: "e7", text: "Choose the correct passive voice: 'The manager will complete the report.'", options: ["The report will be completed by the manager.", "The report is completed by the manager.", "The report was completed by the manager.", "The report completes by the manager."], answer: 0, topic: "Grammar & Error Spotting", source: "Old Paper" },
    { id: "e8", text: "Choose the synonym of 'Meticulous'.", options: ["Careless", "Careful", "Quick", "Lazy"], answer: 1, topic: "Vocabulary & Synonyms", source: "Old Paper" },
    { id: "e9", text: "Identify the error: 'She don't like going to the market on Sundays.'", options: ["She don't", "like going", "to the market", "on Sundays"], answer: 0, topic: "Grammar & Error Spotting", source: "Predicted" },
    { id: "e10", text: "Choose the antonym of 'Genuine'.", options: ["Authentic", "Real", "Fake", "True"], answer: 2, topic: "Vocabulary & Synonyms", source: "Old Paper" },
    { id: "e11", text: "Fill in the blank: 'By the time the police arrived, the thief ____ escaped.'", options: ["has", "had", "have", "having"], answer: 1, topic: "Grammar & Error Spotting", source: "Old Paper" },
    { id: "e12", text: "Choose the word that best completes: 'The officer was known for his ____ approach to duty.'", options: ["negligent", "diligent", "reluctant", "indifferent"], answer: 1, topic: "Vocabulary & Synonyms", source: "Predicted" },
  ],
};