export interface NoteEntry {
  id: string;
  subject: string;
  topic: string;
  title: string;
  body: string; // plain text with \n\n for paragraphs, "- " prefix for bullets
}

export const NOTES: NoteEntry[] = [
  {
    id: "n1", subject: "Reasoning", topic: "Percentage, Profit & Loss",
    title: "Simple Interest vs Compound Interest",
    body: "Simple Interest (SI) is calculated only on the principal amount.\nSI = (P × R × T) / 100\n\nCompound Interest (CI) is calculated on principal + accumulated interest.\nCI = P(1 + R/100)^T − P\n\nKey shortcut: For 2 years, CI − SI = P × (R/100)²\n\n- SI grows linearly (straight line)\n- CI grows exponentially (curves upward)\n- CI is always ≥ SI for the same P, R, T (equal only when T=1)",
  },
  {
    id: "n2", subject: "Reasoning", topic: "Time, Work & Wages",
    title: "Work Efficiency Method",
    body: "Instead of fractions, assign total work as LCM of individual days.\n\nExample: A takes 12 days, B takes 18 days.\nLCM(12,18) = 36 units of work.\nA's efficiency = 36/12 = 3 units/day\nB's efficiency = 36/18 = 2 units/day\nTogether = 5 units/day → Time = 36/5 = 7.2 days\n\nThis method avoids fraction arithmetic under time pressure — faster than the (a×b)/(a+b) formula for mental math.",
  },
  {
    id: "n3", subject: "General Studies", topic: "Telangana Movement & State Formation",
    title: "Telangana Statehood Timeline",
    body: "1948 — Operation Polo, Hyderabad State merges with India\n1956 — States Reorganisation Act forms Andhra Pradesh (merging Telangana with Andhra)\n1969 — First major separate-Telangana agitation (JAC led by students)\n2001 — TRS (Telangana Rashtra Samithi) founded by K. Chandrashekar Rao\n2009-2014 — Second phase of the movement intensifies\n2 June 2014 — Telangana becomes India's 29th state\n\n- Remember: Statehood came via the Andhra Pradesh Reorganisation Act, 2014\n- K. Chandrashekar Rao became the first Chief Minister",
  },
  {
    id: "n4", subject: "General Studies", topic: "Indian Polity & Economy",
    title: "Fundamental Rights vs Directive Principles",
    body: "Fundamental Rights (Part III, Articles 12-35): justiciable, enforceable in court.\nDirective Principles (Part IV, Articles 36-51): not justiciable, but fundamental to governance.\n\n- Article 17: abolishes untouchability\n- Article 21: protection of life and personal liberty\n- Article 32: right to constitutional remedies (Dr. Ambedkar called this the 'heart and soul' of the Constitution)\n\nDPSPs guide policy-making (e.g. Article 44 - Uniform Civil Code, Article 48 - protecting cattle and improving breeds) but courts cannot force the government to implement them.",
  },
  {
    id: "n5", subject: "English", topic: "Grammar & Error Spotting",
    title: "Subject-Verb Agreement Traps",
    body: "Common exam traps:\n\n- 'Neither...nor' and 'Either...or' — verb agrees with the noun closest to it\n  e.g. 'Neither the teacher nor the students were present.'\n- Collective nouns (team, jury, family) usually take singular verb when acting as one unit\n  e.g. 'The team is playing well.'\n- Indefinite pronouns (each, everyone, nobody) are always singular\n  e.g. 'Each of the students has submitted the assignment.' (NOT 'have')",
  },
  {
    id: "n6", subject: "Telugu", topic: "వ్యాకరణం (Grammar)",
    title: "సంధులు (Sandhi) బేసిక్స్",
    body: "సంధి అంటే రెండు పదాలు కలిసినప్పుడు ఏర్పడే మార్పు.\n\nప్రధాన సంధులు:\n- అకారసంధి: ఒక పదం చివర 'అ' మరో పదం మొదట అచ్చు ఉన్నప్పుడు\n- ఇకారసంధి: 'ఇ' తో అంతమయ్యే పదానికి\n- గుణసంధి, వృద్ధిసంధి కూడా ముఖ్యమైనవి\n\nపరీక్షలో ఎక్కువగా అకారసంధి మరియు ఇకారసంధి ప్రశ్నలు వస్తాయి.",
  },
];