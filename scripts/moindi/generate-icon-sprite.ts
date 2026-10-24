// builds public/moindi/icons.svg from the moindi icon library, so SvgIcon can <use> icons by name
// without shipping ~360kb of svg strings in the client bundle

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { SVG_ICONS } from "../../demos/moindi/data/icons-library";

const outputPath = resolve(process.cwd(), "public/moindi/icons.svg");

// the library was exported with a flat gray fill; currentColor lets the text-* classes color it
const HARDCODED_FILLS = /#d9d9d9|#1c2e45/gi;

const symbols = new Map<string, string>();

for (const [category, icons] of Object.entries(SVG_ICONS)) {
  for (const [name, svg] of Object.entries(icons)) {
    if (!svg) continue;

    const viewBox = svg.match(/viewBox="([^"]+)"/)?.[1];
    const body = svg.match(/<svg[^>]*>([\s\S]*)<\/svg>/)?.[1];
    if (!viewBox || !body) {
      console.warn(`skipped ${category}/${name}: couldn't parse svg`);
      continue;
    }

    if (symbols.has(name)) {
      console.warn(`${category}/${name} replaces an earlier icon with the same name`);
    }

    symbols.set(
      name,
      `<symbol id="${name}" viewBox="${viewBox}">${body.replace(HARDCODED_FILLS, "currentColor")}</symbol>`,
    );
  }
}

const sprite = `<svg xmlns="http://www.w3.org/2000/svg">\n${[...symbols.values()].join("\n")}\n</svg>\n`;

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, sprite);
console.log(`wrote ${symbols.size} icons to ${outputPath}`);
