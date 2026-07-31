import type { VercelRequest, VercelResponse } from "@vercel/node";
import { signToken } from "./_lib/auth";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const { password } = req.body || {};
  if (password !== process.env.APP_PASSWORD) return res.status(401).json({ error: "Invalid password" });

  const token = signToken();
  res.setHeader("Set-Cookie", `si_session=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000`);
  res.status(200).json({ ok: true });
}