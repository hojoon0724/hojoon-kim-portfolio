// a circular arrow: restart from the beginning. sized and colored by its parent (currentColor)
export function ReplayIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 12a8 8 0 1 0 2.34-5.66" />
      <path d="M4 4v5h5" />
    </svg>
  );
}
