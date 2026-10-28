"use client";

import { createContext, useContext, useMemo, useState } from "react";

interface DemoSidebar {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}

const DemoSidebarContext = createContext<DemoSidebar | null>(null);

// stands in for the original's SidebarService: the nav toggles it, and DemoMain lays the sidebar out beside the page
export function DemoSidebarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const value = useMemo(
    () => ({
      isOpen,
      toggle: () => setIsOpen((open) => !open),
      close: () => setIsOpen(false),
    }),
    [isOpen],
  );

  return (
    <DemoSidebarContext.Provider value={value}>
      {children}
    </DemoSidebarContext.Provider>
  );
}

export function useDemoSidebar() {
  const sidebar = useContext(DemoSidebarContext);
  if (!sidebar) {
    throw new Error("useDemoSidebar must be used inside DemoSidebarProvider");
  }
  return sidebar;
}
