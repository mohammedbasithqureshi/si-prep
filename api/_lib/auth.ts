import crypto from "crypto";

const SECRET = process.env.AUTH_SECRET || "dev-secret-change-me";

export function signToken(): string {
  const payload = `si-prep|${Date.now()}`;
  const sig = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
  return Buffer.from(`${payload}|${sig}`).toString("base64");
}

export function verifyToken(token?: string): boolean {
  if (!token) return false;
  try {
    const decoded = Buffer.from(token, "base64").toString("utf8");
    const [prefix, ts, sig] = decoded.split("|");
    const payload = `${prefix}|${ts}`;
    const expected = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
    if (sig !== expected) return false;
    const age = Date.now() - Number(ts);
    return age < 1000 * 60 * 60 * 24 * 30; // 30 day session
  } catch {
    return false;
  }
}

export function parseCookie(header: string | undefined, name: string): string | undefined {
  if (!header) return undefined;
  const match = header.split(";").map((c) => c.trim()).find((c) => c.startsWith(`${name}=`));
  return match?.split("=")[1];
}