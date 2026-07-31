import { verifyToken, parseCookie } from "./_lib/auth";
export default function handler(req, res) {
    const token = parseCookie(req.headers.cookie, "si_session");
    if (verifyToken(token))
        return res.status(200).json({ ok: true });
    return res.status(401).json({ ok: false });
}
