import type { EasterEgg } from "@/demos/moindi/data/easter-eggs";

type EasterEggModalProps = {
  egg: EasterEgg;
  foundCount: number;
  total: number;
};

// body of the easter egg found modal; the egg's name is the modal title
export function EasterEggModal({
  egg,
  foundCount,
  total,
}: EasterEggModalProps) {
  return (
    <div className="easter-egg-modal-content flex flex-col gap-(--standard-space)">
      <p className="m-0">{egg.message}</p>
      <p className="m-0 text-xs">
        {egg.description}. {foundCount} of {total} easter eggs found.
      </p>
    </div>
  );
}
