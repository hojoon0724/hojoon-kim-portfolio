"use client";

import { EasterEggModal } from "@/demos/moindi/components/EasterEggModal";
import { useDemoAuth } from "@/demos/moindi/components/DemoAuthProvider";
import {
  useDemoModal,
  type ModalOptions,
} from "@/demos/moindi/components/DemoModalProvider";
import { easterEggs, type EasterEggId } from "@/demos/moindi/data/easter-eggs";

// call the returned function from whatever action counts as finding an egg.
// it records the egg in the session and opens the found modal with its copy from easter-eggs.ts.
// options can override the modal's buttons, e.g. to carry on with the action after the modal is closed
export function useEasterEgg() {
  const { session, findEasterEgg } = useDemoAuth();
  const { openModal } = useDemoModal();

  return (id: EasterEggId, options: Partial<ModalOptions> = {}) => {
    const egg = easterEggs[id];
    const found = session?.easterEggsFound ?? [];
    // the session updates after this render, so the count includes this egg by hand
    const foundCount = found.includes(id) ? found.length : found.length + 1;

    findEasterEgg(id);
    return openModal({
      title: `Easter egg found: ${egg.name}`,
      content: (
        <EasterEggModal
          egg={egg}
          foundCount={foundCount}
          total={Object.keys(easterEggs).length}
        />
      ),
      confirmButtonText: "Nice",
      showCancelButton: false,
      ...options,
    });
  };
}
