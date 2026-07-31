export default function handler(_req, res) {
    res.setHeader("Set-Cookie", "si_session=; Path=/; HttpOnly; Max-Age=0");
    res.status(200).json({ ok: true });
}
