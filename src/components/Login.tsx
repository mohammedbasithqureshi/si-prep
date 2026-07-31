import React, { useState } from "react";
import { login } from "../lib/api";
import { ShieldCheck } from "lucide-react";

export default function Login({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const ok = await login(password);
    if (ok) onSuccess();
    else setError("Wrong password");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-sky-50 px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border border-sky-100 bg-white p-8 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <ShieldCheck className="text-sky-500" size={22} />
          <h1 className="font-bold text-slate-800" style={{ fontFamily: "Sora" }}>SI Prep — Private Access</h1>
        </div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="mb-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none"
        />
        {error && <p className="mb-2 text-xs text-pink-600">{error}</p>}
        <button className="w-full rounded-lg bg-sky-500 py-2 font-semibold text-white">Enter</button>
      </form>
    </div>
  );
}