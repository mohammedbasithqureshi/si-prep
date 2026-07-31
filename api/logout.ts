import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader("Set-Cookie", "si_session=; Path=/; HttpOnly; Max-Age=0");
  res.status(200).json({ ok: true });
}