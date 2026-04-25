import { Section } from "@/components/1-atoms";

export function CssShow() {
  return (
    <>
      <Section className="my-4" fullWidth>
        <div className="surface-divs grid grid-cols-4">
          <div className="surface-heavy bg-surface-heavy h-20 flex flex-col justify-center items-center">
            <div className="text-on-surface-heavy">Surface Heavy</div>
            <div className="text-accent-on-surface-base">text-accent</div>
          </div>
          <div className="surface-base bg-surface-base h-20 flex flex-col justify-center items-center">
            <div className="text-on-surface-base">Surface Base</div>
            <div className="text-accent-on-surface-base">text-accent</div>
          </div>
          <div className="surface-light bg-surface-light h-20 flex flex-col justify-center items-center">
            <div className="text-on-surface-light">Surface Light</div>
            <div className="text-accent-on-surface-base">text-accent</div>
          </div>
          <div className="surface-inverted bg-surface-inverted h-20 flex flex-col justify-center items-center">
            <div className="text-on-surface-inverted">Surface Inverted</div>
            <div className="text-accent-on-surface-inverted">text-accent</div>
          </div>
        </div>
      </Section>
      <Section className="text-test-container flex flex-col gap-2">
        <div className="section-title text-4xl mb-4 mt-8">Typography</div>
        <div className="roboto-base text-6xl text-accent-on-surface-base">Roboto Base</div>
        <div className="roboto-flex">
          <div className="font-thin text-3xl">The quick brown fox jumps over the lazy dog.</div>
          <div className="font-extralight text-3xl">The quick brown fox jumps over the lazy dog.</div>
          <div className="font-light text-3xl">The quick brown fox jumps over the lazy dog.</div>
          <div className="font-normal text-3xl">The quick brown fox jumps over the lazy dog.</div>
          <div className="font-medium text-3xl">The quick brown fox jumps over the lazy dog.</div>
          <div className="font-semibold text-3xl">The quick brown fox jumps over the lazy dog.</div>
          <div className="font-bold text-3xl">The quick brown fox jumps over the lazy dog.</div>
          <div className="font-extrabold text-3xl">The quick brown fox jumps over the lazy dog.</div>
          <div className="font-black text-3xl">The quick brown fox jumps over the lazy dog.</div>
        </div>
        <div className="roboto-wide text-6xl text-accent-on-surface-base">Roboto Wide</div>
        <div className="roboto-wide">
          <div className="roboto-wide font-thin text-3xl">The quick brown fox jumps over the lazy dog.</div>
          <div className="roboto-wide font-extralight text-3xl">The quick brown fox jumps over the lazy dog.</div>
          <div className="roboto-wide font-light text-3xl">The quick brown fox jumps over the lazy dog.</div>
          <div className="roboto-wide font-normal text-3xl">The quick brown fox jumps over the lazy dog.</div>
          <div className="roboto-wide font-medium text-3xl">The quick brown fox jumps over the lazy dog.</div>
          <div className="roboto-wide font-semibold text-3xl">The quick brown fox jumps over the lazy dog.</div>
          <div className="roboto-wide font-bold text-3xl">The quick brown fox jumps over the lazy dog.</div>
          <div className="roboto-wide font-extrabold text-3xl">The quick brown fox jumps over the lazy dog.</div>
          <div className="roboto-wide font-black text-3xl">The quick brown fox jumps over the lazy dog.</div>
        </div>
      </Section>
      <Section className="colors-test-container flex flex-col gap-2" fullWidth>
        <div className="section-title text-4xl mb-4 mt-8">Colors</div>
        <div className="peak flex gap-2 flex-row">
          <div className="flex flex-col justify-center items-center h-20 w-20 bg-accent">
            <div className="text-accent">Text</div>
            <div className="text-gray-900">Text</div>
            <div className="text-gray-100">Text</div>
          </div>
        </div>
        <div className="primary flex gap-2 flex-row">
          <div className="flex flex-col justify-center items-center h-20 w-20 bg-primary-30">
            <div className="text-accent">Text</div>
            <div className="text-gray-900">Text</div>
            <div className="text-gray-100">Text</div>
          </div>
          <div className="flex flex-col justify-center items-center h-20 w-20 bg-primary-50">
            <div className="text-accent">Text</div>
            <div className="text-gray-900">Text</div>
            <div className="text-gray-100">Text</div>
          </div>
          <div className="flex flex-col justify-center items-center h-20 w-20 bg-primary-100">
            <div className="text-accent">Text</div>
            <div className="text-gray-900">Text</div>
            <div className="text-gray-100">Text</div>
          </div>
          <div className="flex flex-col justify-center items-center h-20 w-20 bg-primary-200">
            <div className="text-accent">Text</div>
            <div className="text-gray-900">Text</div>
            <div className="text-gray-100">Text</div>
          </div>
          <div className="flex flex-col justify-center items-center h-20 w-20 bg-primary-300">
            <div className="text-accent">Text</div>
            <div className="text-gray-900">Text</div>
            <div className="text-gray-100">Text</div>
          </div>
          <div className="flex flex-col justify-center items-center h-20 w-20 bg-primary-400">
            <div className="text-accent">Text</div>
            <div className="text-gray-900">Text</div>
            <div className="text-gray-100">Text</div>
          </div>
          <div className="flex flex-col justify-center items-center h-20 w-20 bg-primary-500">
            <div className="text-accent">Text</div>
            <div className="text-gray-900">Text</div>
            <div className="text-gray-100">Text</div>
          </div>
          <div className="flex flex-col justify-center items-center h-20 w-20 bg-primary-600">
            <div className="text-accent">Text</div>
            <div className="text-gray-900">Text</div>
            <div className="text-gray-100">Text</div>
          </div>
          <div className="flex flex-col justify-center items-center h-20 w-20 bg-primary-700">
            <div className="text-accent">Text</div>
            <div className="text-gray-900">Text</div>
            <div className="text-gray-100">Text</div>
          </div>
          <div className="flex flex-col justify-center items-center h-20 w-20 bg-primary-800">
            <div className="text-accent">Text</div>
            <div className="text-gray-900">Text</div>
            <div className="text-gray-100">Text</div>
          </div>
          <div className="flex flex-col justify-center items-center h-20 w-20 bg-primary-900">
            <div className="text-accent">Text</div>
            <div className="text-gray-900">Text</div>
            <div className="text-gray-100">Text</div>
          </div>
          <div className="flex flex-col justify-center items-center h-20 w-20 bg-primary-950">
            <div className="text-accent">Text</div>
            <div className="text-gray-900">Text</div>
            <div className="text-gray-100">Text</div>
          </div>
          <div className="flex flex-col justify-center items-center h-20 w-20 bg-primary-970">
            <div className="text-accent">Text</div>
            <div className="text-gray-900">Text</div>
            <div className="text-gray-100">Text</div>
          </div>
        </div>

        <div className="neutral flex gap-2 flex-row">
          <div className="flex flex-col justify-center items-center h-20 w-20 bg-gray-30">
            <div className="text-accent">Text</div>
            <div className="text-gray-900">Text</div>
            <div className="text-gray-100">Text</div>
          </div>
          <div className="flex flex-col justify-center items-center h-20 w-20 bg-gray-50">
            <div className="text-accent">Text</div>
            <div className="text-gray-900">Text</div>
            <div className="text-gray-100">Text</div>
          </div>
          <div className="flex flex-col justify-center items-center h-20 w-20 bg-gray-100">
            <div className="text-accent">Text</div>
            <div className="text-gray-900">Text</div>
            <div className="text-gray-100">Text</div>
          </div>
          <div className="flex flex-col justify-center items-center h-20 w-20 bg-gray-200">
            <div className="text-accent">Text</div>
            <div className="text-gray-900">Text</div>
            <div className="text-gray-100">Text</div>
          </div>
          <div className="flex flex-col justify-center items-center h-20 w-20 bg-gray-300">
            <div className="text-accent">Text</div>
            <div className="text-gray-900">Text</div>
            <div className="text-gray-100">Text</div>
          </div>
          <div className="flex flex-col justify-center items-center h-20 w-20 bg-gray-400">
            <div className="text-accent">Text</div>
            <div className="text-gray-900">Text</div>
            <div className="text-gray-100">Text</div>
          </div>
          <div className="flex flex-col justify-center items-center h-20 w-20 bg-gray-500">
            <div className="text-accent">Text</div>
            <div className="text-gray-900">Text</div>
            <div className="text-gray-100">Text</div>
          </div>
          <div className="flex flex-col justify-center items-center h-20 w-20 bg-gray-600">
            <div className="text-accent">Text</div>
            <div className="text-gray-900">Text</div>
            <div className="text-gray-100">Text</div>
          </div>
          <div className="flex flex-col justify-center items-center h-20 w-20 bg-gray-700">
            <div className="text-accent">Text</div>
            <div className="text-gray-900">Text</div>
            <div className="text-gray-100">Text</div>
          </div>
          <div className="flex flex-col justify-center items-center h-20 w-20 bg-gray-800">
            <div className="text-accent">Text</div>
            <div className="text-gray-900">Text</div>
            <div className="text-gray-100">Text</div>
          </div>
          <div className="flex flex-col justify-center items-center h-20 w-20 bg-gray-900">
            <div className="text-accent">Text</div>
            <div className="text-gray-900">Text</div>
            <div className="text-gray-100">Text</div>
          </div>
          <div className="flex flex-col justify-center items-center h-20 w-20 bg-gray-950">
            <div className="text-accent">Text</div>
            <div className="text-gray-900">Text</div>
            <div className="text-gray-100">Text</div>
          </div>
          <div className="flex flex-col justify-center items-center h-20 w-20 bg-gray-970">
            <div className="text-accent">Text</div>
            <div className="text-gray-900">Text</div>
            <div className="text-gray-100">Text</div>
          </div>
        </div>
      </Section>
    </>
  );
}
