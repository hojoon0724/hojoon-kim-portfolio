"use client";
import Image from "next/image";
import { useState } from "react";
import { Section } from "../1-atoms";

interface WorkItem {
  title: string;
  description: string;
  imageUrl: string;
  bgColor: string;
}

const items: WorkItem[] = [
  {
    title: "MOindi",
    description: "Description for project one.",
    imageUrl: "/svg/moindi.svg",
    bgColor: "red",
  },
  {
    title: "enSRQ",
    description: "Description for project two.",
    imageUrl: "/svg/ensrq.svg",
    bgColor: "blue",
  },
  {
    title: "Rocket City New Music",
    description: "Description for project three.",
    imageUrl: "/svg/rcnm.svg",
    bgColor: "green",
  },
];

export function WorkGallery() {
  const [selectedItem, setSelectedItem] = useState<WorkItem | null>(null);
  const handleItemHover = (item: WorkItem) => {
    setSelectedItem(item);
  };

  return (
    <div className="work-gallery-container relative h-full w-full">
      <div className="image-overlay-container absolute inset-0 z-10 w-full border opacity-20">
        {selectedItem && (
          <Image
            src={selectedItem.imageUrl}
            alt={selectedItem.title}
            fill
            style={{
              objectFit: "cover",
              backgroundColor: selectedItem.bgColor,
            }}
          />
        )}
      </div>

      <Section className="z-20 lg:pt-[calc(var(--spacing-nav)+(var(--spacing-md)*2))]">
        <div className="work-items-container gap-lg relative z-10 grid grid-cols-1 border md:grid-cols-2">
          {items.map((item) => (
            <div
              key={item.title}
              className="work-item text-accent gap-sm flex aspect-4/3 flex-col items-center justify-center"
              onMouseEnter={() => handleItemHover(item)}
            >
              <div className="item-image-container relative h-full w-full overflow-hidden border">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  style={{ objectFit: "cover", backgroundColor: item.bgColor }}
                />
              </div>
              <h2>{item.title}</h2>
            </div>
          ))}
        </div>
      </Section>
      <pre>{JSON.stringify(selectedItem, null, 2)}</pre>
    </div>
  );
}
