import type { ReactNode } from "react";

// how tall a brand visual is: the height left on phones (the slide area is a size container there), and on md
// and up the same height as the designed-in-code showcases
export const visualHeight =
  "h-[max(240px,calc(100cqh-1rem))] md:h-[min(calc(280px*150/71.9),calc(100svh-24rem))]";

// a stage measured in units (w by h) that keeps its shape and fits whatever box it's given. it's an inline-size
// container, so anything inside can size text off its width
export function Stage({
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
    <div className="[container-type:size] flex size-full min-h-0 items-center justify-center">
      <div
        className={`[container-type:inline-size] relative ${className}`}
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
