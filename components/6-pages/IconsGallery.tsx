import { Icon, Section } from "@/components/1-atoms";
import { SVG_ICONS } from "@/data";

export function IconsGallery() {
  return (
    <Section className="flex flex-col gap-xl w-full">
      {Object.keys(SVG_ICONS).map((category) => (
        <div className="category-container flex justify-center flex-col" key={category}>
          <h2>{category}</h2>
          <div className="icons-grid flex flex-wrap gap-2">
            {Object.keys(SVG_ICONS[category]).map((iconName) => {
              const iconKey = `${category}.${iconName}`;
              return (
                <div key={iconKey} className="icon-container w-51 flex flex-row items-center gap-sm">
                  <div className="w-8 h-8 border border-on-surface-base/30">
                    <Icon icon={iconKey} />
                  </div>
                  <div className="text-sm text-left">{iconName}</div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </Section>
  );
}
