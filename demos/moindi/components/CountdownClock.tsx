"use client";

import { useNow } from "@/demos/moindi/hooks/use-now";
import { countdownEndDate } from "@/demos/moindi/lib/countdown";
import { formatDateTime } from "@/demos/moindi/lib/format";

function formatTimeLeft(endDate: Date, now: Date) {
  const totalSeconds = Math.floor((endDate.getTime() - now.getTime()) / 1000);
  if (totalSeconds <= 0) return "FINISHED";

  const pad = (n: number) => n.toString().padStart(2, "0");
  const days = pad(Math.floor(totalSeconds / (3600 * 24)));
  const hours = pad(Math.floor((totalSeconds % (3600 * 24)) / 3600));
  const minutes = pad(Math.floor((totalSeconds % 3600) / 60));
  const seconds = pad(totalSeconds % 60);
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

// time left until the demo's shared countdown end (see lib/countdown), ticking every second,
// with the end date underneath
export function CountdownClock({
  label = "Ends in:",
  showEndDate = true,
}: {
  label?: string;
  showEndDate?: boolean;
}) {
  const now = useNow();
  const endDate = now ? countdownEndDate() : null;
  const timeLeft = now && endDate ? formatTimeLeft(endDate, now) : "";

  return (
    <div className="project-deadline-remaining-time space-mono flex flex-col text-left md:text-right">
      <div className="countdown-container space-mono whitespace-nowrap">
        {timeLeft !== "FINISHED" && (
          <span className="opacity-50">{label} </span>
        )}
        {timeLeft}
      </div>
      {showEndDate && (
        <div className="project-deadline-date text-xs opacity-50">
          {/* waits for mount, since the server's time zone may differ from the visitor's */}
          {endDate && formatDateTime(endDate)}
        </div>
      )}
    </div>
  );
}
