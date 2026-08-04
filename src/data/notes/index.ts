import { reasoningNotes } from "./reasoning";
import { generalStudiesNotes } from "./generalStudies";
import { englishNotes } from "./english";
import { teluguNotes } from "./telugu";

export const NOTES = [
  ...reasoningNotes,
  ...generalStudiesNotes,
  ...englishNotes,
  ...teluguNotes,
];

export type { NoteEntry } from "./types";