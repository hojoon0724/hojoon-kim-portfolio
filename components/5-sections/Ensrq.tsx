import { Section } from "@/components/1-atoms";

export function Ensrq() {
  return (
    <Section
      className="moindi-summary flex h-dvh w-screen snap-x snap-mandatory snap-start flex-row items-center justify-start overflow-x-scroll"
      data-snap-container
      fullWidth
    >
      <div
        className="section-1 h-dvh w-screen shrink-0 snap-start bg-teal-500"
        data-snap-target
      >
        section 1
      </div>
      <div
        className="section-2 h-dvh w-screen shrink-0 snap-start bg-teal-600"
        data-snap-target
      >
        section 2
      </div>
      <div
        className="section-3 h-dvh w-screen shrink-0 snap-start bg-teal-700"
        data-snap-target
      >
        section 3
      </div>
      <div
        className="section-4 h-dvh w-screen shrink-0 snap-start bg-teal-800"
        data-snap-target
      >
        section 4
      </div>
    </Section>
  );
}
