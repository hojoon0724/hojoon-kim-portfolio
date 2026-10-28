import {
  DemoAuthProvider,
  DemoMain,
  DemoModalProvider,
  DemoNav,
  DemoSidebarProvider,
} from "@/demos/moindi/components";
import "@/demos/moindi/styles/moindi-demo.css";
import type { Metadata } from "next";
import { Space_Grotesk, Space_Mono } from "next/font/google";

// moindi's own type, scoped to the demo so the rest of the portfolio keeps Roboto
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

export const metadata: Metadata = {
  title: "MOindi Demo | Hojoon Kim",
  description:
    "An interactive rebuild of MOindi with invented data. Not a real investment product.",
};

export default function MoindiDemoLayout({
  children,
}: LayoutProps<"/moindi/demo">) {
  return (
    <div
      className={`${spaceGrotesk.className} ${spaceGrotesk.variable} ${spaceMono.variable} flex min-h-dvh flex-col`}
    >
      <DemoAuthProvider>
        <DemoModalProvider>
          <DemoSidebarProvider>
            <DemoNav />
            <main className="flex w-full flex-1">
              <DemoMain>{children}</DemoMain>
            </main>
          </DemoSidebarProvider>
          {/* relative + z-40 so it stays above the sidebar (z-30) */}
          <footer className="moindi-footer-container relative z-40 flex min-h-8 w-full items-center justify-center bg-(--secondary-800)">
            <div className="footer-content-container mx-auto max-w-7xl text-center text-xs text-white">
              Just a heads up... you’re still in a demo. Nothing here is real.
            </div>
          </footer>
        </DemoModalProvider>
      </DemoAuthProvider>
    </div>
  );
}
