"use client";

import { useEffect, useState } from "react";

// counts down to a date some way off, set after mount so the server and client agree, then a tick every second
export function useCountdown(durationMs: number) {
  const [endDate, setEndDate] = useState<number | null>(null);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const start = Date.now();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEndDate(start + durationMs);
    setNow(start);
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [durationMs]);

  if (endDate === null || now === null) return null;

  const totalSeconds = Math.max(0, Math.floor((endDate - now) / 1000));
  const pad = (n: number) => n.toString().padStart(2, "0");
  return {
    endDate: new Date(endDate),
    text: `${pad(Math.floor(totalSeconds / 86400))}d ${pad(Math.floor((totalSeconds % 86400) / 3600))}h ${pad(Math.floor((totalSeconds % 3600) / 60))}m ${pad(totalSeconds % 60)}s`,
  };
}
