import type { VercelRequest, VercelResponse } from "@vercel/node";
import { verifyToken, parseCookie } from "./_lib/auth";

export default function handler(req: VercelRequest, res: VercelResponse) {
  const token = parseCookie(req.headers.cookie, "si_session");
  if (verifyToken(token)) return res.status(200).json({ ok: true });
  return res.status(401).json({ ok: false });
}