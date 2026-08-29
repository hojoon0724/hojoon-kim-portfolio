import { FullScreenSlide } from "@/components/2-molecules";

const project = {
  backgroundClassName: "bg-moindi-orange",
  textColorClassName: "text-gray-950",
};

export function MoindiIntro() {
  return (
    <FullScreenSlide
      backgroundClassName={project.backgroundClassName}
      textColorClassName={project.textColorClassName}
    >
      <div className="content-container gap-lg mx-auto flex h-full w-full max-w-4xl items-center justify-center border">
        <div className="context-overview">
          <h2>Building the product from the ground up</h2>

          <p>
            MOindi was an early-stage platform exploring a new model for
            investing in independent music. When I joined, the product was still
            taking shape: the brand lacked a cohesive system, the interface
            needed to be designed, and the underlying experience had to
            reconcile a financial product with the culture of independent music.
          </p>

          <p>
            I led the work across brand, product, UX/UI, and frontend
            implementation, working closely with the CTO to turn the concept
            into a functioning product—from identity and design systems through
            interface design and code.
          </p>
        </div>
      </div>
    </FullScreenSlide>
  );
}
