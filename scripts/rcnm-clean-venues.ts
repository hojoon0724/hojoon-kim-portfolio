import { venues as rawVenues } from "../rcnm-raw-data/venues";
import {
  createId,
  createUniqueIds,
  removeNotionLink,
  writeCleanFile,
  type RawRecord,
} from "./rcnm-clean-utils";

// usage: npm run clean-venues

// "2211 Seminole Dr SW\nHuntsville, AL 35805" -> { street, city, state, postalCode, country }
function separateAddress(address: string | null) {
  const match = address?.match(/^(.+)\r?\n(.+),\s*([A-Z]{2})\s+(\d{5})$/);
  if (!match) return { street: address ?? null };

  const [, street, city, state, postalCode] = match;
  return { street, city, state, postalCode, country: "USA" };
}

const namedVenues = (rawVenues as RawRecord[]).filter((venue) => venue.name);
const ids = createUniqueIds(namedVenues.map((venue) => venue.name!));

const cleanedVenues = namedVenues.map((venue, index) => ({
  id: ids[index],
  name: venue.name,
  address: separateAddress(venue.address),
  contact: removeNotionLink(venue.contact).map(createId),
  inEvents: removeNotionLink(venue.events).map(createId),
  website: venue.website,
}));

writeCleanFile("venues", cleanedVenues);
