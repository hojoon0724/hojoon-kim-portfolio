import { events as rawEvents } from "../rcnm-raw-data/events";
import { repertoire as rawRepertoire } from "../rcnm-raw-data/repertoire";
import {
  createId,
  createRepertoireIds,
  createUniqueIds,
  removeNotionLink,
  separateDateAndTime,
  writeCleanFile,
  type RawRecord,
} from "./rcnm-clean-utils";

// usage: npm run clean-events

const firstSeasonYear = 2022;

// "03-01-1 - 3… 2… 1… LOOK!" / "01-03-2: Outside the Box" -> season 03, event 01, title
function separateName(name: string) {
  const match = name.match(/^(\d{2})-(\d{2})-([\dX])\s*[:-]?\s*(.+)$/);
  return {
    season: match ? match[1] : null,
    eventNumber: match ? match[2] : null,
    nameStage: match && match[3] !== "X" ? Number(match[3]) : null,
    title: match ? match[4].trim() : name,
  };
}

// "Season 5" -> "05" / "2023 Spring / Summer" -> "02" (season 01 was 2022, pre-launch is 00)
function cleanSeason(season: string | null): string | null {
  const seasonNumber = season?.match(/^Season (\d+)$/)?.[1];
  if (seasonNumber) return seasonNumber.padStart(2, "0");

  const year = season?.match(/^(\d{4})/)?.[1];
  if (!year) return null;
  return String(Number(year) - firstSeasonYear + 1).padStart(2, "0");
}

// "Stage 2" -> 2 / "Other" -> 0
function cleanStage(stage: string | null): number | null {
  if (stage === "Other") return 0;
  const stageNumber = stage?.match(/^Stage (\d)$/)?.[1];
  return stageNumber ? Number(stageNumber) : null;
}

// events list their repertoire by title, so look the id up from the repertoire data
const repertoireIds = createRepertoireIds(rawRepertoire as RawRecord[]);
const repertoireIdByTitle = new Map<string, string>();
(rawRepertoire as RawRecord[]).forEach((piece, index) => {
  const title = createId(piece.name ?? "");
  if (!repertoireIdByTitle.has(title)) {
    repertoireIdByTitle.set(title, repertoireIds[index]);
  }
});

const namedEvents = (rawEvents as RawRecord[]).filter((event) => event.name);
const ids = createUniqueIds(namedEvents.map((event) => event.name!));

const cleanedEvents = namedEvents.map((event, index) => {
  const { season, eventNumber, nameStage, title } = separateName(event.name!);
  const { date, time } = separateDateAndTime(event.date);

  return {
    id: ids[index],
    season: season ?? cleanSeason(event.season),
    eventNumber,
    eventStage: cleanStage(event.stage) ?? nameStage,
    title,
    eventDate: date,
    eventTime: event.time ?? time,
    venueId: removeNotionLink(event.venue).map(createId),
    musicians: removeNotionLink(event.musicians).map(createId),
    staff: removeNotionLink(event.staff).map(createId),
    repertoire: removeNotionLink(event.repertoire).map((pieceTitle) => ({
      repertoireId:
        repertoireIdByTitle.get(createId(pieceTitle)) ?? createId(pieceTitle),
      isCommission: false,
      commissionText: null,
      isPremiere: false,
      premiereText: null,
    })),
    status: event.status,
    description: event.websiteBlurb,
  };
});

writeCleanFile("events", cleanedEvents);
