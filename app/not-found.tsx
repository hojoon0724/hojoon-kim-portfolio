import Image from "next/image";

export default function NotFoundPage() {
  return (
    <div className="gap-md p-md mx-auto flex h-dvh max-w-150 flex-1 flex-col items-center justify-center">
      <div className="not-found-text-container gap-md flex flex-col items-center justify-center">
        <div className="roboto-narrow text-center text-7xl text-accent-text">404</div>
        <div className="roboto-mono text-center text-xl ">Page Not Found</div>
      </div>
      <div className="image-container relative aspect-4/3 w-full">
        <Image
          src="/sus-dog.png"
          alt="what are you doing snooping around?"
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100svw, 600px"
          loading="eager"
        />
      </div>
      <div className="bottom-text-container roboto-mono gap-md flex flex-col items-center justify-center text-center text-sm">
        <div className="roboto-mono py-md text-xl text-accent-text">How did you get here?</div>
        <div className="roboto-mono text-balance">
          Either something’s broken or you’re snooping around.
        </div>
        <div className="roboto-mono text-balance">Explain yourself.</div>
      </div>
    </div>
  );
}
