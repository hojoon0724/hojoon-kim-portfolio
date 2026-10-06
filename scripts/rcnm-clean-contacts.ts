import { contacts as rawContacts } from "../rcnm-raw-data/contacts";
import {
  createId,
  createUniqueIds,
  removeNotionLink,
  separateName,
  splitList,
  writeCleanFile,
  type RawRecord,
} from "./rcnm-clean-utils";

// usage: npm run clean-contacts

type RawContact = RawRecord;

const membershipYears = ["22", "23", "24", "25"];
const membershipTiers = ["Voyager", "Cassini", "Gemini", "Member", "Small Donor"];
const organizationPattern =
  /\b(LLC|Inc|Studio|Pros|Occasions|Bar|Grill)\b|&|^Guest of /;

function isOrganization(name: string): boolean {
  return !name.includes(" ") || organizationPattern.test(name);
}

function makeFoundingMemberBoolean(value: string | null): boolean {
  return value === "Yes";
}

function separateCategory(category: string | null): string[] {
  return splitList(category).filter((item) => item !== "NEEDS REVIEW");
}

// "Musician" follows the instrument: added when there is one, removed when there isn't
function syncMusicianCategory(
  categories: string[],
  instruments: string[],
): string[] {
  const withoutMusician = categories.filter((item) => item !== "Musician");
  return instruments.length > 0
    ? [...withoutMusician, "Musician"]
    : withoutMusician;
}

function mergeInstrument(
  instrument1: string | null,
  instrument2: string | null,
): string[] {
  const instruments = [...splitList(instrument1), ...splitList(instrument2)].map(
    (instrument) => (instrument === "Drumset" ? "Drum Set" : instrument),
  );
  return [...new Set(instruments)];
}

// "mailto:name@site.com" and "https://app.notion.comname@site.com" -> "name@site.com"
function cleanEmailLink(email: string | null): string | null {
  if (!email) return null;
  return (
    email
      .replace("mailto:", "")
      .replace("https://app.notion.com", "")
      .trim()
      .toLowerCase() || null
  );
}

// "(256)555-0100" / "256.555.0100" / "+1 (256) 555-0100" -> "(256) 555-0100"
function cleanPhone(phone: string | null): string | null {
  if (!phone || phone.includes("@")) return null;

  const [number, extension] = phone.split(/,?\s*ext\.?\s*/i);
  const digits = number.replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "");
  if (digits.length !== 10) return phone.replace(/[^\x20-\x7E]/g, "").trim();

  const formatted = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  return extension ? `${formatted} ext. ${extension}` : formatted;
}

// "Nashville, TN" / "Boston MA" -> { city, state }
function separateLocation(location: string | null) {
  const match = location?.match(/^(.+?),?\s+([A-Z]{2})$/);
  return {
    city: match ? match[1] : location,
    state: match ? match[2] : null,
    country: null,
  };
}

// "22Level" / "22Status" ... "25Level" / "25Status" -> one history entry per year
function consolidateLevelAndStatus(contact: RawContact) {
  return membershipYears.flatMap((year) => {
    const level = contact[`${year}Level`];
    const status = contact[`${year}Status`];
    if (!level && !status) return [];

    // levels like "Not Donating in 2024" aren't tiers, so they're kept as the status
    const isTier = level !== null && membershipTiers.includes(level);
    return [
      {
        seasonId: `20${year}`,
        membershipTier: isTier ? level : null,
        status: isTier ? status : (status ?? level),
      },
    ];
  });
}

const namedContacts = (rawContacts as RawContact[]).filter(
  (contact) => contact.name,
);

const ids = createUniqueIds(namedContacts.map((contact) => contact.name!));

const cleanedContacts = namedContacts.map((contact, index) => {
  const name = contact.name!;
  const organization = isOrganization(name);
  const phoneIsEmail = contact.phone?.includes("@");
  const instrument = mergeInstrument(contact.instrument, contact.instrument2);

  const notes = [
    contact.category?.includes("NEEDS REVIEW") ? "Needs review" : null,
    name.match(/\((.*?)\)/)?.[1] ?? null,
  ].filter(Boolean);

  return {
    id: ids[index],
    ...(organization
      ? { firstName: null, middleName: null, lastName: null }
      : separateName(name)),
    spouse: contact.togetherWith ? createId(contact.togetherWith) : null,

    organization: organization ? name : contact.affiliation,
    mailingAddress: contact.mailingAddress?.replace(/\s*\r?\n\s*/g, ", ") ?? null,
    generalLocation: separateLocation(contact.location),
    phone: cleanPhone(contact.phone),
    email: cleanEmailLink(phoneIsEmail ? contact.phone : contact.email),
    category: syncMusicianCategory(
      separateCategory(contact.category),
      instrument,
    ),

    venue: removeNotionLink(contact.venue).map(createId),
    instrument,
    hiredFor: removeNotionLink(contact.hiredFor).map(createId),
    dietaryRestrictions: /^none$/i.test(contact.dietaryRestrictions ?? "")
      ? null
      : contact.dietaryRestrictions,
    tShirtSize: contact.tShirtSize,
    instagram: contact.instagram,

    membership: {
      foundingMember: makeFoundingMemberBoolean(contact.foundingMember),
      history: consolidateLevelAndStatus(contact),
    },

    notes: notes.join(", ") || null,
  };
});

writeCleanFile("contacts", cleanedContacts);
