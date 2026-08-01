const REMINDER_KEY = "siprep_reminder_time"; // "HH:MM" 24hr format
const PERMISSION_ASKED_KEY = "siprep_notif_asked";

export function getReminderTime(): string | null {
  return localStorage.getItem(REMINDER_KEY);
}

export function setReminderTime(time: string) {
  localStorage.setItem(REMINDER_KEY, time);
}

export function clearReminder() {
  localStorage.removeItem(REMINDER_KEY);
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const result = await Notification.requestPermission();
  return result === "granted";
}

export function hasAskedBefore(): boolean {
  return localStorage.getItem(PERMISSION_ASKED_KEY) === "true";
}
export function markAsked() {
  localStorage.setItem(PERMISSION_ASKED_KEY, "true");
}

// Checks every minute while the tab is open — fires once per day at the set time.
// Note: this only works while the browser/tab is open. True background daily
// notifications (even when the app is closed) need a Service Worker + Push API
// with a backend to trigger it — meaningfully more infra than a personal
// single-user prep tool needs. This covers "remind me while I'm around."
export function startReminderWatcher() {
  const lastFiredKey = "siprep_reminder_last_fired";
  setInterval(() => {
    const time = getReminderTime();
    if (!time || Notification.permission !== "granted") return;
    const now = new Date();
    const current = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const today = now.toISOString().slice(0, 10);
    const lastFired = localStorage.getItem(lastFiredKey);
    if (current === time && lastFired !== today) {
      new Notification("SI Prep — Time to practice!", {
        body: "Keep your streak alive. Take today's mock test or review a few flashcards.",
        icon: "/favicon.svg",
      });
      localStorage.setItem(lastFiredKey, today);
    }
  }, 60000); // check every minute
}