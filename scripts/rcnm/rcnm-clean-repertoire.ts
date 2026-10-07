import { repertoire as rawRepertoire } from "../../rcnm-raw-data/repertoire";
import {
  createEventId,
  createId,
  createRepertoireIds,
  removeNotionLink,
  splitList,
  writeCleanFile,
  type RawRecord,
} from "./rcnm-clean-utils";
import { withFullComposerNames } from "./rcnm-guess-composer-id";

// usage: npm run clean-repertoire

const ensembleSizes: Record<string, string> = {
  solo: "1",
  Duo: "2",
  Trio: "3",
  Quartet: "4",
};

// "????" -> null
function cleanYear(year: string | null): string | null {
  return year && /\d/.test(year) ? year : null;
}

// "10" / "15'" / "25 minutes" -> "10 min" ... / "4'30"" -> "4 min 30 sec", anything else is left alone
function cleanDuration(length: string | null): string | null {
  if (!length) return null;
  const value = length.replace(/’/g, "'").replace(/”/g, '"').trim();

  const minutesAndSeconds = value.match(
    /^(\d+)\s*(?:'|min)\s*(\d+)\s*(?:"|sec)$/i,
  );
  if (minutesAndSeconds) {
    return `${minutesAndSeconds[1]} min ${minutesAndSeconds[2]} sec`;
  }

  const minutes = value.match(/^(\d+)\s*(?:min'?|minutes|mi|in|'|")?$/i);
  return minutes ? `${minutes[1]} min` : value;
}

// "cello, alto saxaphone" -> ["Cello", "Alto Saxophone"]
function cleanInstrumentation(instrumentation: string | null): string[] {
  return splitList(instrumentation).map((instrument) =>
    instrument
      .replace(/saxaphone/gi, "saxophone")
      .replace(/(^|\s)([a-z])/g, (_, space, letter) => space + letter.toUpperCase()),
  );
}

// "Trio, solo" -> ["1", "3"] / "12+, open" -> ["12+", "open"]
function cleanEnsembleSize(ensembleSize: string | null): string[] {
  return splitList(ensembleSize)
    .map((size) => ensembleSizes[size] ?? size)
    .sort((a, b) => (parseInt(a) || Infinity) - (parseInt(b) || Infinity));
}

// "Quartet: https://vimeo.com/123" -> "https://vimeo.com/123"
function getLinks(...values: (string | null)[]): string[] {
  return values.flatMap((value) => value?.match(/https?:\/\/\S+/g) ?? []);
}

const repertoire = withFullComposerNames(rawRepertoire as RawRecord[]);
const ids = createRepertoireIds(repertoire);

const cleanedRepertoire = repertoire.map((piece, index) => ({
  id: ids[index],
  title: piece.name,
  composer: piece.composer ? createId(piece.composer) : null,
  year: cleanYear(piece.year),
  duration: cleanDuration(piece.length),
  instrumentation: cleanInstrumentation(piece.instrumentation),
  alternativeInstrumentation: cleanInstrumentation(
    piece.alternativeInstrumentation,
  ),
  ensembleSize: cleanEnsembleSize(piece.ensembleSize),
  inEvents: removeNotionLink(piece.event).map(createEventId),
  recordings: getLinks(piece.recording, piece.videoLink),
}));

writeCleanFile("repertoire", cleanedRepertoire);
