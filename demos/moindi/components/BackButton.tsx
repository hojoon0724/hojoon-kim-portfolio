"use client";

import { useRouter } from "next/navigation";
import { SvgIcon } from "./SvgIcon";

// the original's back link: an arrow that nudges left on hover, back one step in history
export function BackButton({ className = "" }: { className?: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      className={`flex items-center gap-1 pl-2 transition-all hover:pl-0 ${className}`}
      onClick={() => router.back()}
    >
      <div className="h-8 w-8">
        <SvgIcon iconName="arrow-left" />
      </div>
      <span className="space-mono font-bold uppercase">Back</span>
    </button>
  );
}
