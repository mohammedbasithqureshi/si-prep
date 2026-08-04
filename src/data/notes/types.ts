export interface NoteEntry {
  id: string;
  subject: string;
  topic: string;
  title: string;
  body: string; // plain text, \n\n for paragraphs, "- " prefix for bullets
}