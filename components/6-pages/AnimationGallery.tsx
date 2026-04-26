import { Section } from "@/components/1-atoms";
import { AnimationTrigger } from "@/components/2-molecules";

export function AnimationGallery() {
  return (
    <Section className="mb-xl">
      <h1>Animations</h1>

      <div className="animations-container grid grid-cols-1 md:grid-cols-2 gap-sm">
        
        <AnimationTrigger
          animationClass="animation-fade-in"
          animationName="fade-in"
          duration={1000}
          startVisible={false}
        />
        <AnimationTrigger
          animationClass="animation-fade-out"
          animationName="fade-out"
          duration={1000}
          startVisible={true}
        />
        <AnimationTrigger
          animationClass="animation-fade-in-up-8"
          animationName="fade-in-up-8"
          duration={1000}
          startVisible={false}
        />
        <AnimationTrigger
          animationClass="animation-fade-in-up-16"
          animationName="fade-in-up-16"
          duration={1000}
          startVisible={false}
        />

        <AnimationTrigger
          animationClass="animation-fade-in-down-8"
          animationName="fade-in-down-8"
          duration={1000}
          startVisible={false}
        />
        <AnimationTrigger
          animationClass="animation-fade-in-down-16"
          animationName="fade-in-down-16"
          duration={1000}
          startVisible={false}
        />
        <AnimationTrigger
          animationClass="animation-fade-out-up-8"
          animationName="fade-out-up-8"
          duration={1000}
          startVisible={true}
        />
        <AnimationTrigger
          animationClass="animation-fade-out-up-16"
          animationName="fade-out-up-16"
          duration={1000}
          startVisible={true}
        />

        <AnimationTrigger
          animationClass="animation-fade-out-down-8"
          animationName="fade-out-down-8"
          duration={1000}
          startVisible={true}
        />
        <AnimationTrigger
          animationClass="animation-fade-out-down-16"
          animationName="fade-out-down-16"
          duration={1000}
          startVisible={true}
        />
        <AnimationTrigger
          animationClass="animation-left-to-right"
          animationName="left to right"
          duration={1000}
          startVisible={true}
        />
        <AnimationTrigger
          animationClass="animation-left-to-right"
          animationName="left to right"
          duration={1000}
          startVisible={true}
        />
      </div>
    </Section>
  );
}
