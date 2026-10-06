import { ViewTransition } from "react";

// templates remount on route change, so the outgoing and incoming pages get exit/enter transitions
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition
      enter={{ "project-forward": "page-slide-in-from-right", default: "none" }}
      exit={{ "project-forward": "page-slide-out-to-left", default: "none" }}
      default="none"
    >
      {children}
    </ViewTransition>
  );
}
