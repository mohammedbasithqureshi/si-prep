const BASE = "/api";

export async function login(password: string) {
  const res = await fetch(`${BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  return res.ok;
}

export async function checkSession(): Promise<boolean> {
  const res = await fetch(`${BASE}/session`);
  return res.ok;
}

export async function logout() {
  await fetch(`${BASE}/logout`, { method: "POST" });
}

export async function fetchCurrentAffairs() {
  const res = await fetch(`${BASE}/current-affairs`);
  if (!res.ok) return [];
  return res.json();
}