import { Subject } from "../../types";

export const telugu: Subject = {
  id: "telugu",
  name: "Telugu",
  short: "Telugu",
  accent: "yellow",
  duration: 20,
  topics: [
    { name: "వ్యాకరణం (Grammar)", weight: 30 },
    { name: "గద్యం-పద్యం అవగాహన (Comprehension)", weight: 28 },
    { name: "పర్యాయపదాలు (Synonyms)", weight: 22 },
    { name: "లేఖ / వ్యాస రచన (Letter/Essay)", weight: 20 },
  ],
  questions: [
    { id: "t1", text: "'నేను పాఠశాలకు వెళ్తాను' వాక్యంలో క్రియా పదం ఏది?", options: ["నేను", "పాఠశాలకు", "వెళ్తాను", "ఏదీ కాదు"], answer: 2, topic: "వ్యాకరణం (Grammar)", source: "Old Paper" },
    { id: "t2", text: "'నిర్భయ' పదానికి పర్యాయపదం గుర్తించండి.", options: ["భయపడేవాడు", "ధైర్యవంతుడు", "బలహీనుడు", "అలసిపోయినవాడు"], answer: 1, topic: "పర్యాయపదాలు (Synonyms)", source: "Predicted" },
    { id: "t3", text: "'రాముడు వనవాసం చేసాడు' వాక్యంలో కర్త ఏది?", options: ["రాముడు", "వనవాసం", "చేసాడు", "ఏదీ కాదు"], answer: 0, topic: "వ్యాకరణం (Grammar)", source: "Old Paper" },
    { id: "t4", text: "'కష్టం' పదానికి వ్యతిరేక పదం గుర్తించండి.", options: ["సుఖం", "బాధ", "కోపం", "దుఃఖం"], answer: 0, topic: "పర్యాయపదాలు (Synonyms)", source: "Old Paper" },
    { id: "t5", text: "తెలుగు వర్ణమాలలో మొత్తం అచ్చులు ఎన్ని?", options: ["12", "13", "14", "16"], answer: 2, topic: "వ్యాకరణం (Grammar)", source: "Predicted" },
  ],
};