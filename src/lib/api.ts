const BASE = "/api";

export async function fetchCurrentAffairs() {
  const res = await fetch(`${BASE}/current-affairs`);
  if (!res.ok) return [];
  return res.json();
}