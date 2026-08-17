

import { About } from "@/components/5-sections";

export function Landing() {
  return (
    <div
      className="landing-container no-main-spacing flex h-dvh w-full snap-y snap-mandatory flex-col items-center justify-start overflow-y-auto"
      data-snap-container
    >
      <About />
    </div>
  );
}
