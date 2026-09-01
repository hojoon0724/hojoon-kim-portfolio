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
      <div className="expanded-summary-container gap-lg mx-auto my-auto flex w-full max-w-4xl flex-col items-center justify-start overflow-scroll">
        <div className="content-container p-md">
          <div className="project-vitals-table py-lg mb-2xl">
            <div className="project-vitals-row flex flex-row items-baseline">
              <div className="project-vitals-label w-[12ch] text-base leading-relaxed font-semibold md:text-lg">
                Who:
              </div>
              <div className="project-vitals-value w-full max-w-prose text-base leading-snug text-pretty md:text-lg">
                MOindi
              </div>
            </div>
            <div className="project-vitals-row flex flex-row items-baseline">
              <div className="project-vitals-label w-[12ch] text-base leading-relaxed font-semibold md:text-lg">
                What:
              </div>
              <div className="project-vitals-value w-full max-w-prose text-base leading-snug text-pretty md:text-lg">
                A platform that would allow independent artists to sell equity
                in their music directly to fans and investors.
              </div>
            </div>
            <div className="project-vitals-row flex flex-row items-baseline">
              <div className="project-vitals-label w-[12ch] text-base leading-relaxed font-semibold md:text-lg">
                Role:
              </div>
              <div className="project-vitals-value w-full max-w-prose text-base leading-snug text-pretty md:text-lg">
                Director of Brand & Product
              </div>
            </div>
            <div className="project-vitals-row flex flex-row items-baseline">
              <div className="project-vitals-label w-[12ch] text-base leading-relaxed font-semibold md:text-lg">
                Stage:
              </div>
              <div className="project-vitals-value w-full max-w-prose text-base leading-snug text-pretty md:text-lg">
                Early: no working product, established brand, or defined
                customer experience.
              </div>
            </div>
          </div>

          <div className="landscape-text-container gap-md grid w-full grid-cols-1 md:grid-cols-[auto_1fr] items-center justify-center">
            <div className="landscape-section-title roboto-wide col-span-1 text-xl font-bold md:text-2xl">
              The Story
            </div>

            <div className="text gap-md flex max-w-prose flex-col text-base text-pretty md:order-3 ">
              <p className="">
                The founders came to me to build the brand and prepare the
                company to raise funding. The problem was, there was no product
                to brand yet, no working prototype, no market research, no
                customer journey, no product roadmap, and no clear definition of
                what the experience should be.
              </p>
              <p className="font-semibold">They needed a product first.</p>
            </div>

            <div className="challenge-text-container roboto-narrow py-md border-y text-center text-2xl font-light text-balance md:text-3xl md:row-span-2 md:order-2 ">
              “The problem was, there was no product to brand yet.”
            </div>
          </div>
        </div>
      </div>
    </FullScreenSlide>
  );
}
