import type { ReactNode } from "react";

// a stage measured in units (w by h) that keeps its shape and fits whatever box it's given. it's an inline-size
// container, so anything inside can size text off its width
export function FitStage({
  w,
  h,
  children,
  className = "",
}: {
  w: number;
  h: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="@container-[size] flex size-full min-h-0 items-center justify-center">
      <div
        className={`@container relative ${className}`}
        style={{
          width: `min(100cqw, 100cqh * ${w / h})`,
          aspectRatio: `${w} / ${h}`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
