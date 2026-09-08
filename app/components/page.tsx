import {
  AnimationGallery,
  AtomsGallery,
  CssShow,
  IconsGallery,
} from "@/components/6-pages";
import { toolsList } from "@/data/tools-list";
import Image from "next/image";

export default function ComponentsGallery() {
  return (
    <>
      <IconsGallery />
      <div className="headings-test mb-12 flex flex-col gap-8 p-16">
        <h1>This is heading 1</h1>
        <h2>This is heading 2</h2>
        <h3>This is heading 3</h3>
        <h4>This is heading 4</h4>
        <h5>This is heading 5</h5>
      </div>
      <div className="tools-list-container grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {toolsList.map((tool) => (
          <div
            key={tool.id}
            className="flex w-full flex-row items-center justify-start"
          >
            <Image
              src={`/icons/tools/icons_${tool.id}.webp`}
              alt={tool.name}
              width={64}
              height={64}
            />
            <div className="text-container text-left">
              <div className="text-sm">{tool.id}</div>
              <div className="text-sm">{tool.name}</div>
            </div>
          </div>
        ))}
      </div>
      {toolsList.length}
      <hr className="my-8" />
      <CssShow />
      <AnimationGallery />
      <AtomsGallery />
    </>
  );
}
