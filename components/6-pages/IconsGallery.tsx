import { Icon, Section } from "@/components/1-atoms";
import { SVG_ICONS } from "@/data";

export function IconsGallery() {
  return (
    <Section className="gap-xl grid w-full grid-cols-4">
      {Object.keys(SVG_ICONS).map((icon) => (
        <div
          className="category-container flex flex-col justify-center"
          key={icon}
        >
          <div className="icon-container gap-sm flex w-full flex-row items-center">
            <div className="border-on-surface-base/30 h-24 w-24">
              <Icon icon={icon} color="var(--surface-accent)" />
            </div>
            <div className="border-on-surface-base/30 h-12 w-12">
              <Icon icon={icon} />
            </div>
            <div className="border-on-surface-base/30 h-6 w-6">
              <Icon icon={icon} />
            </div>
            <div className="text-left text-sm">{icon}</div>
          </div>
        </div>
      ))}
    </Section>
  );
}
