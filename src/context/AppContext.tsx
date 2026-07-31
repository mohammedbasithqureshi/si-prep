import React, { createContext, useContext, useEffect, useState } from "react";
import { getStreak, bumpStreak, StreakData } from "../lib/storage";

interface Ctx {
  streak: StreakData;
  refreshStreak: () => void;
}
const AppContext = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [streak, setStreak] = useState<StreakData>(getStreak());
  const refreshStreak = () => setStreak(bumpStreak());
  useEffect(() => { setStreak(getStreak()); }, []);
  return <AppContext.Provider value={{ streak, refreshStreak }}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}