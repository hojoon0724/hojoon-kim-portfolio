import { SvgIcon } from "@/demos/moindi/components";
import { SVG_ICONS } from "@/demos/moindi/data/icons-library";

// every icon in the library, grouped by category, drawn from the sprite the way the demo uses them.
// a server component, so the library's svg strings are only read at build time, never shipped to the client
export default function MoindiDemoIcons() {
  const categories = Object.entries(SVG_ICONS);
  const total = categories.reduce(
    (count, [, icons]) => count + Object.keys(icons).length,
    0,
  );

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-(--standard-space-double) p-(--standard-space)">
      <header className="flex flex-col gap-(--standard-space)">
        <h1 className="space-mono text-3xl font-bold uppercase">Icons</h1>
        <p className="text-sm">
          {total} icons in {categories.length} categories. Use the name under
          each icon as <code>iconName</code>.
        </p>
        <nav className="flex flex-wrap gap-x-(--standard-space) gap-y-1 text-sm">
          {categories.map(([category]) => (
            <a key={category} href={`#${category}`} className="underline">
              {category}
            </a>
          ))}
        </nav>
      </header>

      {categories.map(([category, icons]) => {
        const names = Object.keys(icons);
        return (
          <div
            key={category}
            id={category}
            className="flex scroll-mt-(--nav-height) flex-col gap-(--standard-space)"
          >
            <h2 className="space-mono border-b pb-1 text-xl font-bold uppercase">
              {category}{" "}
              <span className="text-sm font-normal">({names.length})</span>
            </h2>
            {names.length === 0 ? (
              <p className="text-sm">No icons in this category.</p>
            ) : (
              <ul className="grid grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-(--standard-space)">
                {names.map((name) => (
                  <li
                    key={name}
                    className="flex flex-col items-center gap-1 border p-(--standard-space) text-center"
                  >
                    <div className="h-8 w-8">
                      <SvgIcon iconName={name} />
                    </div>
                    <span className="text-xs wrap-anywhere">{name}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
