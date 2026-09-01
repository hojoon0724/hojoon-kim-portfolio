import { Landing } from "@/components/6-pages/Landing";

export default function Home() {

  return (
    <div
      className="landing-container no-main-spacing flex h-dvh w-full snap-y snap-mandatory flex-col items-center justify-start overflow-y-auto"
      data-snap-container
    >
      <Landing />
    </div>
  );
}
