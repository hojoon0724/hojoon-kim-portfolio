import { RcnmLogoAnimation } from "@/components/1-atoms/RcnmLogoAnimation";
import { ProjectSectionSnapTargetContainer } from "@/components/4-organisms";
import Image from "next/image";

/* guides for building the section

the argument: taste driven by concept. lean and visual, not step-by-step, and not a guidelines deep-dive like
moindi's (moindi is about systems, this is about taste and fit).

order: state the concept, reveal the logo and its double meaning, show the motif pulsing on scroll,
then palette and type as the concept extended.

- concept: 1960s rocket-era, apollo program, von braun-style american optimism: a "we can do anything" persona.
  rooted in huntsville, where the rocket engines are actually made, so the era is the city's own identity, not decoration.
  it also mirrors the market thesis: a city of people building what's never been built, and a concert experience built from scratch.
- color: nasa logo red and blue, used heavily. a dark gray and a cream white, added to avoid pure black and white.
  a range of working shades on top of those.
- logo: a pill-shaped sound wave built from vertical forms, with r, c and m hidden in it. blended curved lines that read as
  both audio waves and the plume behind a rocket, so one mark holds both halves of the organization: music and rockets.
- motif: blended curved lines, made with illustrator's blend tool, that overlap into a moiré pattern. on screen the pattern
  appears to pulse as you scroll. the same optical trick as the sonos logo, and the page should name that lineage.
- typography: futura, uppercase only, letter-spacing matched to the apollo 11 plaque left on the moon, which is set in futura.
  a one-line callout next to the type specimen.
*/

// an image the section is waiting on. set src once the file is in /public/rcnm and the placeholder is replaced.
// label says what belongs in the slot, and doubles as the alt text
type ImageSlotData = { src: string; label: string };

const heroImage: ImageSlotData = {
  src: "",
  label: "Hero: the identity in use, full bleed",
};

// the moiré only shows when the fine lines meet the screen's pixels, so this needs the artwork at full resolution
const motifImage: ImageSlotData = {
  src: "",
  label:
    "Motif: the blended curves at full resolution, tall enough to scroll through",
};

const typeSpecimen: ImageSlotData = {
  src: "",
  label:
    "Type specimen: Futura, uppercase, with the Apollo 11 plaque beside it",
};

// what to notice in the logo. the last one is the point: the double meaning
const logoNotes = [
  "A pill-shaped sound wave built from vertical forms, with R, C, and M hidden in it.",
  "Blended curved lines that read as both audio waves and the plume of smoke behind a rocket.",
  "One mark holds both halves of the organization: music and rockets.",
];

// class names are written out in full so tailwind can find them
const palette = [
  {
    name: "NASA red",
    note: "From the NASA logo",
    hex: "#FC3D21",
    swatch: "bg-rcnm-red-500 text-rcnm-black-700",
    shades: [
      "bg-rcnm-red-200",
      "bg-rcnm-red-300",
      "bg-rcnm-red-400",
      "bg-rcnm-red-600",
      "bg-rcnm-red-700",
      "bg-rcnm-red-800",
    ],
  },
  {
    name: "NASA blue",
    note: "From the NASA logo",
    hex: "#0B3D91",
    swatch: "bg-rcnm-blue-500 text-rcnm-white-300",
    shades: [
      "bg-rcnm-blue-200",
      "bg-rcnm-blue-300",
      "bg-rcnm-blue-400",
      "bg-rcnm-blue-600",
      "bg-rcnm-blue-700",
      "bg-rcnm-blue-800",
    ],
  },
  {
    name: "Dark gray",
    note: "In place of pure black",
    hex: "#101823",
    swatch: "bg-rcnm-black-500 text-rcnm-white-300",
    shades: [
      "bg-rcnm-black-200",
      "bg-rcnm-black-300",
      "bg-rcnm-black-400",
      "bg-rcnm-black-600",
      "bg-rcnm-black-700",
      "bg-rcnm-black-800",
    ],
  },
  {
    name: "Cream white",
    note: "In place of pure white",
    hex: "#FCF8F0",
    swatch: "bg-rcnm-white-300 text-rcnm-black-700",
    shades: [
      "bg-rcnm-white-200",
      "bg-rcnm-white-400",
      "bg-rcnm-white-500",
      "bg-rcnm-white-600",
      "bg-rcnm-white-700",
      "bg-rcnm-white-800",
    ],
  },
];

// span sets how much of the mosaic each piece takes. posters are tall, programs are wide, social posts are square
const applications: (ImageSlotData & { span: string })[] = [
  {
    src: "",
    label: "Poster",
    span: "col-span-2 row-span-2 md:col-span-2 md:row-span-4",
  },
  {
    src: "",
    label: "Program, cover and spread",
    span: "col-span-2 md:col-span-4 md:row-span-2",
  },
  { src: "", label: "Social post", span: "md:col-span-2 md:row-span-2" },
  { src: "", label: "Social post", span: "md:col-span-2 md:row-span-2" },
  {
    src: "",
    label: "Poster",
    span: "col-span-2 row-span-2 md:col-span-2 md:row-span-4",
  },
  {
    src: "",
    label: "The identity in the room: signage, screen or stage",
    span: "col-span-2 md:col-span-4 md:row-span-4",
  },
];

// fills its parent. shows the image once it has a src, and a labelled placeholder until then
function ImageSlot({
  image,
  sizes = "100vw",
  labelAtTop = false,
}: {
  image: ImageSlotData;
  sizes?: string;
  // for a slot whose bottom edge is covered by a caption
  labelAtTop?: boolean;
}) {
  if (!image.src) {
    return (
      <div
        className={`border-rcnm-black-200 bg-rcnm-black-600 p-sm flex h-full w-full border border-dashed ${labelAtTop ? "items-start" : "items-end"}`}
      >
        <p className="roboto-mono text-rcnm-white-800 text-xs md:text-sm">
          {image.label}
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <Image
        src={image.src}
        alt={image.label}
        fill
        sizes={sizes}
        className="object-cover"
      />
    </div>
  );
}

// image first: five plates, each mostly picture with a caption's worth of text.
// the first plate carries the nav id, so the nav item covers all five
export function RcnmVisualIdentity({ id }: { id: string }) {
  return (
    <>
      {/* plate 1: the concept, as a caption over a full bleed image */}
      <ProjectSectionSnapTargetContainer
        id={id}
        tag="header"
        className="flex flex-col justify-end"
      >
        <div className="absolute inset-0">
          <ImageSlot image={heroImage} labelAtTop />
        </div>
        <div className="from-rcnm-black-700 px-md lg:px-xl gap-sm pt-3xl relative flex flex-col bg-linear-to-t to-transparent pb-16">
          <h5 className="text-rcnm-red-400">Brand</h5>
          <h1 className="max-w-5xl text-balance">Taste driven by concept</h1>
          <p className="text-rcnm-white-500 max-w-prose text-base md:text-lg">
            1960s rocket-era, Apollo-program American optimism: a “we can do
            anything” persona.
          </p>
          <p className="text-rcnm-white-700 max-w-prose text-sm md:text-base">
            It&apos;s rooted in Huntsville itself, where the rocket engines are
            actually made. The era is the city&apos;s own identity, not
            decoration.
          </p>
        </div>
      </ProjectSectionSnapTargetContainer>

      {/* plate 2: the logo, as large as the screen allows, with what to notice underneath */}
      <ProjectSectionSnapTargetContainer
        id={`${id}-logo`}
        tag="section"
        className="px-md lg:px-xl gap-2xl flex flex-col justify-center py-16"
      >
        <Image
          src="/logos/rcnm-logo-on-dark.png"
          alt="Rocket City New Music logo"
          width={4601}
          height={1402}
          sizes="(min-width: 1280px) 1152px, 100vw"
          className="mx-auto h-auto w-full max-w-6xl"
        />
        <RcnmLogoAnimation className="mx-auto h-auto w-full max-w-6xl" />
        <ul className="gap-md mx-auto grid w-full max-w-6xl grid-cols-1 md:grid-cols-3">
          {logoNotes.map((note, index) => (
            <li
              key={note}
              className="border-rcnm-black-300 pt-sm gap-sm flex items-baseline border-t"
            >
              <span
                className="roboto-mono text-rcnm-red-400 text-xs md:text-sm"
                aria-hidden="true"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="text-rcnm-white-500 text-sm text-balance md:text-base">
                {note}
              </p>
            </li>
          ))}
        </ul>
      </ProjectSectionSnapTargetContainer>

      {/* plate 3: the motif. it is taller than the screen on purpose: the pattern only pulses while it is being scrolled,
          so the visitor has to scroll through it. the caption stays pinned to the bottom of the screen meanwhile */}
      <ProjectSectionSnapTargetContainer
        id={`${id}-motif`}
        tag="section"
        className="flex min-h-[160dvh] flex-col justify-end"
        snapToEnd
      >
        <div className="absolute inset-0">
          <ImageSlot image={motifImage} labelAtTop />
        </div>
        <div className="from-rcnm-black-700 px-md lg:px-xl gap-sm pt-3xl sticky bottom-0 flex flex-col bg-linear-to-t to-transparent pb-16">
          <h5 className="text-rcnm-red-400">Motif</h5>
          <p className="max-w-prose text-base md:text-lg">
            Blended curved lines that overlap into a moiré pattern. On screen it
            appears to pulse as you scroll: sound made visible.
          </p>
          <p className="text-rcnm-white-700 max-w-prose text-sm md:text-base">
            The same optical trick that made Sonos&apos;s logo pulse, applied to
            sound waves and rocket plumes.
          </p>
        </div>
      </ProjectSectionSnapTargetContainer>

      {/* plate 4: palette and type, edge to edge. the colors are the picture here */}
      <ProjectSectionSnapTargetContainer
        id={`${id}-palette-type`}
        tag="section"
        className="grid grid-cols-1 lg:grid-cols-2"
      >
        <ul className="grid min-h-[60dvh] grid-cols-2 lg:min-h-0">
          {palette.map((color) => (
            <li key={color.name} className={`flex flex-col ${color.swatch}`}>
              <div className="p-sm roboto-mono flex flex-1 flex-col justify-end text-xs md:text-sm">
                <span className="font-bold">{color.name}</span>
                <span>{color.hex}</span>
                <span className="roboto-flex pt-1 opacity-80">
                  {color.note}
                </span>
              </div>
              {/* the working shades, lightest to darkest */}
              <div className="flex h-6" aria-hidden="true">
                {color.shades.map((shade) => (
                  <div key={shade} className={`flex-1 ${shade}`} />
                ))}
              </div>
            </li>
          ))}
        </ul>
        <div className="border-rcnm-black-300 flex min-h-[60dvh] flex-col border-t lg:min-h-0 lg:border-t-0 lg:border-l">
          <div className="flex-1">
            <ImageSlot
              image={typeSpecimen}
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
          <p className="px-md py-sm text-rcnm-white-500 text-sm md:text-base">
            Futura, uppercase only, with letter-spacing matched to the Apollo 11
            plaque left on the moon, which is set in Futura.
          </p>
        </div>
      </ProjectSectionSnapTargetContainer>

      {/* plate 5: the identity applied, as a mosaic with no copy beyond one label */}
      <ProjectSectionSnapTargetContainer
        id={`${id}-applications`}
        tag="section"
        className="p-sm gap-sm flex flex-col"
        snapToEnd
      >
        <h5 className="text-rcnm-red-400 px-xs">Applications</h5>
        <ul className="gap-sm grid flex-1 auto-rows-[40vw] grid-cols-2 md:auto-rows-[minmax(6rem,1fr)] md:grid-cols-6">
          {applications.map((application, index) => (
            <li key={index} className={application.span}>
              <ImageSlot
                image={application}
                sizes="(min-width: 768px) 66vw, 100vw"
              />
            </li>
          ))}
        </ul>
      </ProjectSectionSnapTargetContainer>
    </>
  );
}
