"use client";

import type { DatabaseStory } from "@/data/project-details/rcnm-database-story";
import { useEffect, useRef, useState } from "react";

type TableName = "events" | "venues" | "repertoire" | "contacts" | "ledger";
type StepKey =
  | "events"
  | "venues"
  | "repertoire"
  | "contacts"
  | "ledger"
  | "questions";

interface RcnmDatabaseStoryProps {
  story: DatabaseStory;
}

// -- schema map ---------------------------------------------------------

type MapLayout = "tall" | "wide";

// tall (below md): two columns, three rows. venues above events, repertoire beside it, ledger and contacts along the bottom.
// wide (md and up): three columns, two rows. venues, events, repertoire across the top, ledger and contacts under the last two.
const mapLayouts: Record<
  MapLayout,
  { viewBox: string; nodes: Record<TableName, { x: number; y: number }> }
> = {
  tall: {
    viewBox: "0 0 274 168",
    nodes: {
      venues: { x: 46, y: 22 },
      events: { x: 46, y: 84 },
      repertoire: { x: 228, y: 84 },
      ledger: { x: 46, y: 146 },
      contacts: { x: 228, y: 146 },
    },
  },
  wide: {
    viewBox: "0 0 440 122",
    nodes: {
      venues: { x: 46, y: 22 },
      events: { x: 220, y: 22 },
      repertoire: { x: 394, y: 22 },
      ledger: { x: 220, y: 100 },
      contacts: { x: 394, y: 100 },
    },
  },
};
const mapOrder: TableName[] = [
  "venues",
  "events",
  "repertoire",
  "ledger",
  "contacts",
];

const mapEdges: {
  from: TableName;
  to: TableName;
  label: string;
  steps: StepKey[];
}[] = [
  { from: "events", to: "venues", label: "venueId", steps: ["venues"] },
  {
    from: "events",
    to: "repertoire",
    label: "repertoireId",
    steps: ["repertoire"],
  },
  {
    from: "repertoire",
    to: "contacts",
    label: "composer",
    steps: ["repertoire"],
  },
  {
    from: "events",
    to: "contacts",
    label: "musicians, staff",
    steps: ["contacts"],
  },
  {
    from: "ledger",
    to: "events",
    label: "eventId",
    steps: ["ledger"],
  },
  { from: "ledger", to: "contacts", label: "contact", steps: [] },
];

const tablesByStep: Record<StepKey, TableName[]> = {
  events: ["events"],
  venues: ["events", "venues"],
  repertoire: ["events", "repertoire", "contacts"],
  contacts: ["events", "contacts"],
  ledger: ["events", "ledger"],
  questions: ["events", "venues", "repertoire", "contacts", "ledger"],
};

function SchemaMap({
  step,
  totals,
  layout,
  className = "",
}: {
  step: StepKey;
  totals: DatabaseStory["totals"];
  layout: MapLayout;
  className?: string;
}) {
  const activeTables = tablesByStep[step];
  const { viewBox, nodes: mapNodes } = mapLayouts[layout];

  return (
    <svg
      viewBox={viewBox}
      className={`schema-map h-full w-full ${className}`}
      role="img"
      aria-label={`Five linked tables in a grid: venues, events, repertoire, ledger and contacts. Highlighted now: ${activeTables.join(", ")}.`}
    >
      {mapEdges.map((edge) => {
        const from = mapNodes[edge.from];
        const to = mapNodes[edge.to];
        const isActive = step === "questions" || edge.steps.includes(step);
        const showLabel = edge.steps.includes(step);
        const labelX = (from.x + to.x) / 2;
        const labelY = (from.y + to.y) / 2;
        const labelWidth = edge.label.length * 4.9 + 8;

        return (
          <g key={`${edge.from}-${edge.to}`}>
            <line
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              className="stroke-rcnm-black-200"
              strokeWidth={1}
              strokeDasharray="2 3"
            />
            <line
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              pathLength={1}
              className="stroke-rcnm-red-500 transition-[stroke-dashoffset] duration-700 ease-out motion-reduce:transition-none"
              strokeWidth={1.5}
              strokeDasharray={1}
              strokeDashoffset={isActive ? 0 : 1}
            />
            <g
              className={`transition-opacity duration-300 ${showLabel ? "opacity-100 delay-300" : "opacity-0"}`}
            >
              <rect
                x={labelX - labelWidth / 2}
                y={labelY - 7}
                width={labelWidth}
                height={14}
                rx={7}
                className="fill-rcnm-red-500"
              />
              <text
                x={labelX}
                y={labelY + 3}
                textAnchor="middle"
                className="roboto-mono fill-rcnm-black-700 text-[8px] font-bold"
              >
                {edge.label}
              </text>
            </g>
          </g>
        );
      })}

      {mapOrder.map((table) => {
        const { x, y } = mapNodes[table];
        const isActive = activeTables.includes(table);

        return (
          <g key={table}>
            <rect
              x={x - 40}
              y={y - 15}
              width={80}
              height={30}
              rx={4}
              className={`transition-colors duration-300 ${isActive ? "fill-rcnm-white-300 stroke-rcnm-white-300" : "fill-rcnm-black-600 stroke-rcnm-black-200"}`}
              strokeWidth={1}
            />
            <text
              x={x}
              y={y + 1}
              textAnchor="middle"
              className={`roboto-mono text-[11px] font-bold transition-colors duration-300 ${isActive ? "fill-rcnm-black-700" : "fill-rcnm-white-700"}`}
            >
              {table}
            </text>
            <text
              x={x}
              y={y + 11}
              textAnchor="middle"
              className={`roboto-mono text-[7.5px] transition-colors duration-300 ${isActive ? "fill-rcnm-black-300" : "fill-rcnm-black-200"}`}
            >
              {totals[table].toLocaleString("en-US")} record{totals[table] !== 1 ? "s" : ""}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// -- the event row, always on screen --------------------------------------

function EventRecord({ story, step }: { story: DatabaseStory; step: StepKey }) {
  const { event, venue, ledger } = story;

  const fields: { name: string; value: string; steps: StepKey[] }[] = [
    { name: "id", value: event.id, steps: ["events", "ledger"] },
    { name: "venueId", value: venue.id, steps: ["venues"] },
    {
      name: "repertoire",
      value: `${event.counts.repertoire} ids`,
      steps: ["repertoire"],
    },
    {
      name: "musicians",
      value: `${event.counts.musicians} ids`,
      steps: ["contacts"],
    },
    { name: "staff", value: `${event.counts.staff} ids`, steps: ["contacts"] },
  ];

  return (
    <div className="event-record border-rcnm-black-300 bg-rcnm-black-600 flex h-full flex-col border">
      <div className="border-rcnm-black-300 px-sm py-xs flex h-8 items-center justify-between gap-2 border-b">
        <span className="roboto-mono text-rcnm-white-700 text-[10px] uppercase md:text-xs">
          events
        </span>
        <span className="roboto-wide text-sm font-bold md:text-base">
          {event.title}
        </span>
      </div>
      <dl className="roboto-mono p-sm flex flex-row flex-wrap justify-between gap-1 text-[11px] md:flex-col md:justify-start md:text-xs">
        {fields.map((field) => {
          const isActive = step === "questions" || field.steps.includes(step);
          return (
            <div
              key={field.name}
              className={`px-xs flex items-baseline gap-2 rounded-sm py-0.5 transition-colors duration-300 md:justify-between ${isActive ? "bg-rcnm-red-500 text-rcnm-black-700" : "text-rcnm-white-600"}`}
            >
              <dt className="shrink-0 font-bold">{field.name}</dt>
              <dd className="truncate">{field.value}</dd>
            </div>
          );
        })}
      </dl>
      <p
        className={`roboto-mono text-rcnm-red-300 px-sm pb-sm hidden text-[11px] transition-opacity duration-300 md:block md:text-xs ${step === "ledger" ? "opacity-100" : "opacity-0"}`}
        aria-hidden={step !== "ledger"}
      >
        ← {ledger.entries} ledger rows
      </p>
    </div>
  );
}

// -- what the highlighted link leads to -------------------------------------

function PanelHeader({ table, note }: { table: string; note: string }) {
  return (
    <div className="border-rcnm-black-300 px-sm py-xs roboto-mono text-rcnm-white-700 flex h-8 items-center justify-between border-b text-[10px] uppercase md:text-xs">
      <span>{table}</span>
      <span>{note}</span>
    </div>
  );
}

function LinkedRecords({
  story,
  step,
}: {
  story: DatabaseStory;
  step: StepKey;
}) {
  const { event, venue, program, musicians, crew, ledger, questions } = story;
  const largestGroup = Math.max(...ledger.groups.map((group) => group.total));

  switch (step) {
    case "events":
      return (
        <>
          <PanelHeader table="events" note="reading the id" />
          <div className="p-sm gap-sm flex flex-col">
            <div className="roboto-mono flex gap-2 text-center">
              {[
                { value: event.season, label: "season" },
                { value: event.eventNumber, label: "event" },
                { value: String(event.eventStage), label: "stage" },
              ].map((part) => (
                <div
                  key={part.label}
                  className="border-rcnm-black-200 flex-1 border py-1"
                >
                  <div className="text-rcnm-red-400 text-xl font-bold md:text-2xl">
                    {part.value}
                  </div>
                  <div className="text-rcnm-white-700 text-[10px] uppercase">
                    {part.label}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm md:text-base">
              {event.date}, {event.time}
              <span className="text-rcnm-white-700"> · {event.status}</span>
            </p>
            <p className="text-rcnm-white-700 text-xs md:text-sm">
              Every other field on this row is the id of a row somewhere else.
            </p>
          </div>
        </>
      );

    case "venues":
      return (
        <>
          <PanelHeader table="venues" note="1 row matched" />
          <div className="p-sm gap-sm flex flex-col">
            <div>
              <p className="roboto-mono text-rcnm-red-400 text-xs">
                id: {venue.id}
              </p>
              <p className="roboto-wide text-lg font-bold md:text-xl">
                {venue.name}
              </p>
              <p className="text-rcnm-white-700 text-sm">{venue.location}</p>
            </div>
            <div>
              <p className="roboto-mono text-rcnm-white-700 text-[10px] uppercase md:text-xs">
                the same row also serves
              </p>
              <ul className="text-sm md:text-base">
                {venue.otherEvents.map((title) => (
                  <li key={title} className="truncate">
                    {title}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      );

    case "repertoire":
      return (
        <>
          <PanelHeader
            table="repertoire → contacts"
            note={`${program.length} rows · ${story.programMinutes} min`}
          />
          <ul className="p-sm flex flex-col gap-0.5 text-xs md:gap-1 md:text-sm">
            {program.map((piece) => (
              <li
                key={piece.id}
                className="flex items-baseline justify-between gap-2"
              >
                <span className="truncate">{piece.title}</span>
                <span className="roboto-mono text-rcnm-red-300 shrink-0 text-[10px] md:text-xs">
                  {piece.composer}
                </span>
              </li>
            ))}
          </ul>
        </>
      );

    case "contacts":
      return (
        <>
          <PanelHeader
            table="contacts"
            note={`${musicians.length + crew.length} rows · * also a composer here`}
          />
          <ul className="p-sm grid grid-cols-2 gap-x-3 gap-y-0.5 text-xs leading-tight md:gap-y-1 md:text-sm md:leading-normal">
            {musicians.map((musician) => (
              <li key={musician.id} className="min-w-0">
                <span className="block truncate">
                  {musician.name}
                  {musician.alsoComposer && (
                    <span className="text-rcnm-red-400"> *</span>
                  )}
                </span>
                <span className="roboto-mono text-rcnm-white-700 block truncate text-[10px] md:text-xs">
                  {musician.instrument}
                  <span className="hidden md:inline">
                    {" "}
                    · {musician.concerts}{" "}
                    {musician.concerts === 1 ? "concert" : "concerts"}
                  </span>
                </span>
              </li>
            ))}
            {crew.map((member) => (
              <li key={member.id} className="min-w-0">
                <span className="block truncate">{member.name}</span>
                <span className="roboto-mono text-rcnm-white-700 block truncate text-[10px] md:text-xs">
                  {member.role}
                </span>
              </li>
            ))}
          </ul>
        </>
      );

    case "ledger":
      return (
        <>
          <PanelHeader table="ledger" note={`${ledger.entries} rows matched`} />
          <ul className="p-sm flex flex-col gap-1 text-xs md:gap-2 md:text-sm">
            {ledger.groups.map((group) => (
              <li key={group.name}>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="truncate">{group.name}</span>
                  <span className="roboto-mono shrink-0 text-[10px] md:text-xs">
                    <span className="text-rcnm-white-700">
                      {group.entries} rows ·{" "}
                    </span>
                    ${Math.round(group.total).toLocaleString("en-US")}
                  </span>
                </div>
                <div className="bg-rcnm-black-300 h-1 w-full">
                  <div
                    className="bg-rcnm-red-500 h-full"
                    style={{ width: `${(group.total / largestGroup) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
          <p className="border-rcnm-black-300 px-sm py-xs roboto-mono flex justify-between border-t text-xs md:text-sm">
            <span className="text-rcnm-white-700">total spent</span>
            <span className="font-bold">
              ${Math.round(ledger.total).toLocaleString("en-US")}
            </span>
          </p>
        </>
      );

    case "questions":
      return (
        <>
          <PanelHeader table="all five tables" note="worked out, not stored" />
          <ul className="p-sm gap-sm grid grid-cols-2">
            {questions.map((item) => (
              <li key={item.question} className="min-w-0">
                <p className="text-rcnm-white-700 text-[11px] leading-tight md:text-sm">
                  {item.question}
                </p>
                <p className="roboto-wide text-rcnm-red-400 text-lg leading-tight font-bold md:text-2xl">
                  {item.answer}
                </p>
                <p className="text-[11px] leading-tight md:text-sm">
                  {item.detail}
                </p>
                <p className="roboto-mono text-rcnm-white-800 hidden text-[9px] md:block md:text-[11px]">
                  {item.tables.join(" + ")}
                </p>
              </li>
            ))}
          </ul>
        </>
      );
  }
}

// -- the story --------------------------------------------------------------

export function RcnmDatabaseStory({ story }: RcnmDatabaseStoryProps) {
  const { event, venue, program, musicians, crew, ledger } = story;
  const [activeIndex, setActiveIndex] = useState(0);
  const stepRefs = useRef<(HTMLElement | null)[]>([]);

  const doubleRole = musicians.find((musician) => musician.alsoComposer);

  const steps: {
    key: StepKey;
    label: string;
    heading: string;
    body: string[];
  }[] = [
    {
      key: "events",
      label: "events",
      heading: "It starts as one row",
      body: [
        `${event.title} took place on ${event.date}. In the events table that whole night is a single row.`,
        `Its id says where it sits in the calendar: season ${event.season}, event ${event.eventNumber}, stage ${event.eventStage}. Almost everything else on the row is a pointer to another table.`,
      ],
    },
    {
      key: "venues",
      label: "venues",
      heading: "Where it happened",
      body: [
        `The event doesn't store an address. It stores "${venue.id}", the id of a row in the venues table.`,
        `That one venue row serves ${venue.otherEvents.length + 1} events. If its address or its contact changes, that is one edit and every concert there is correct.`,
      ],
    },
    {
      key: "repertoire",
      label: "repertoire",
      heading: "What was played",
      body: [
        `The program was ${program.length} pieces. Each one is a row in repertoire with its length and the instruments it needs.`,
        `Each piece points on to its composer, who is a row in contacts. The printed program, the running time and the list of instruments to hire all come from the same ${program.length} rows.`,
      ],
    },
    {
      key: "contacts",
      label: "contacts",
      heading: "Who made it happen",
      body: [
        `${musicians.length} musicians and ${crew.length} crew. They all live in one contacts table, because in a small organization people fill more than one role.`,
        doubleRole
          ? `${doubleRole.name} played ${doubleRole.instrument.toLowerCase()} that night and wrote one of the pieces. That is one row with two links, not two records to keep in sync.`
          : "A musician can also be a composer or a donor. That is one row with several links, not several records to keep in sync.",
        "The link works in both directions, so opening a musician shows every concert they have played.",
      ],
    },
    {
      key: "ledger",
      label: "ledger",
      heading: "What it cost",
      body: [
        `${ledger.entries} ledger entries belong to this concert: flights, artist fees, a lighting rental, dinner for the band.`,
        "The link runs the other way here. Each entry carries the event's id, so the cost of a concert is a filter on one column instead of a hunt through receipts.",
      ],
    },
    {
      key: "questions",
      label: "all tables",
      heading: "Then it starts answering questions",
      body: [
        "Once the tables are linked, the organization can ask things no single list could answer.",
        "None of these numbers is typed in anywhere. Each is worked out by following the links.",
      ],
    },
  ];

  useEffect(() => {
    let frameId = 0;

    // on small screens the text scrolls in under the pinned stage, so the line it has to cross sits lower
    const update = () => {
      frameId = 0;
      const isWide = window.matchMedia("(min-width: 1024px)").matches;
      const triggerLine = window.innerHeight * (isWide ? 0.6 : 0.9);

      let nextIndex = 0;
      stepRefs.current.forEach((element, index) => {
        if (element && element.getBoundingClientRect().top < triggerLine) {
          nextIndex = index;
        }
      });
      setActiveIndex(nextIndex);
    };

    const queueUpdate = () => {
      if (frameId === 0) frameId = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", queueUpdate, { passive: true });
    window.addEventListener("resize", queueUpdate);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", queueUpdate);
      window.removeEventListener("resize", queueUpdate);
    };
  }, []);

  const activeStep = steps[activeIndex].key;

  return (
    <div className="rcnm-database-story relative lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      {/* every step's panel is laid out in the same cell, so the box is as tall as the tallest one and never changes size */}
      <div className="stage bg-rcnm-black-500 border-rcnm-black-300 px-md py-sm lg:px-lg sticky top-0 z-10 flex h-fit min-h-[27rem] items-center overflow-hidden border-b lg:order-2 lg:h-svh lg:border-b-0 lg:border-l">
        <div className="stage-content grid w-full grid-cols-1 items-start gap-2 [grid-template-areas:'map''record''linked'] md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:[grid-template-areas:'map_map''record_linked'] lg:gap-4">
          <div className="h-[22svh] max-h-48 [grid-area:map] md:h-40 md:max-h-none lg:h-48">
            <SchemaMap
              step={activeStep}
              totals={story.totals}
              layout="tall"
              className="md:hidden"
            />
            <SchemaMap
              step={activeStep}
              totals={story.totals}
              layout="wide"
              className="hidden md:block"
            />
          </div>
          <div className="h-full [grid-area:record]">
            <EventRecord story={story} step={activeStep} />
          </div>
          <div className="linked-records border-rcnm-black-300 bg-rcnm-black-600 grid border [grid-area:linked]">
            {steps.map((step) => (
              <div
                key={step.key}
                className={`col-start-1 row-start-1 min-w-0 ${step.key === activeStep ? "animation-fade-in" : "invisible"}`}
                aria-hidden={step.key !== activeStep}
              >
                <LinkedRecords story={story} step={step.key} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <ol className="steps px-md lg:px-xl lg:order-1">
        {steps.map((step, index) => (
          <li
            key={step.key}
            ref={(element) => {
              stepRefs.current[index] = element;
            }}
            className={`step pt-lg flex min-h-[70dvh] flex-col justify-start gap-3 transition-opacity duration-500 last:min-h-[45dvh] lg:min-h-dvh lg:justify-center lg:pt-0 lg:last:min-h-dvh ${index === activeIndex ? "opacity-100" : "opacity-30"}`}
          >
            <p className="roboto-mono text-rcnm-red-400 text-xs md:text-sm">
              {String(index + 1).padStart(2, "0")} / {step.label}
            </p>
            <h2>{step.heading}</h2>
            {step.body.map((paragraph) => (
              <p
                key={paragraph}
                className="text-rcnm-white-500 max-w-prose text-base md:text-lg"
              >
                {paragraph}
              </p>
            ))}
          </li>
        ))}
      </ol>
    </div>
  );
}
