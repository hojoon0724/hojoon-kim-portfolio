import { Button, Section } from "@/components/1-atoms";

export function AtomsGallery() {
  return (
    <Section
      className="flex w-full flex-col items-center justify-center"
      fullWidth
    >
      <h1>Atoms</h1>
      <h2>Buttons</h2>
      <div className="flex flex-col items-center justify-center gap-8">
        <div className="sizes flex flex-col items-start gap-4">
          <div className="small flex items-center justify-center gap-2">
            <Button
              variant="filled"
              color="accent"
              text="primary filled"
              size="sm"
            />
            <Button
              variant="filled"
              color="neutral"
              text="neutral filled"
              size="sm"
            />
          </div>
          <div className="medium flex items-center justify-center gap-2">
            <Button
              variant="filled"
              color="accent"
              text="primary filled"
              size="md"
            />
            <Button
              variant="filled"
              color="neutral"
              text="neutral filled"
              size="md"
            />
          </div>
          <div className="large flex items-center justify-center gap-2">
            <Button
              variant="filled"
              color="accent"
              text="primary filled"
              size="lg"
            />
            <Button
              variant="filled"
              color="neutral"
              text="neutral filled"
              size="lg"
            />
          </div>
        </div>
        <div className="sizes flex flex-col items-start gap-4">
          <div className="small flex items-center justify-center gap-2">
            <Button
              variant="outline"
              color="accent"
              text="primary outline"
              size="sm"
            />
            <Button
              variant="outline"
              color="neutral"
              text="neutral outline"
              size="sm"
            />
          </div>
          <div className="medium flex items-center justify-center gap-2">
            <Button
              variant="outline"
              color="accent"
              text="primary outline"
              size="md"
            />
            <Button
              variant="outline"
              color="neutral"
              text="neutral outline"
              size="md"
            />
          </div>
          <div className="large flex items-center justify-center gap-2">
            <Button
              variant="outline"
              color="accent"
              text="primary outline"
              size="lg"
            />
            <Button
              variant="outline"
              color="neutral"
              text="neutral outline"
              size="lg"
            />
          </div>
        </div>
        <div className="sizes flex flex-col items-start gap-4">
          <div className="small flex items-center justify-center gap-2">
            <Button
              variant="ghost"
              color="accent"
              text="primary ghost"
              size="sm"
            />
            <Button
              variant="ghost"
              color="neutral"
              text="neutral ghost"
              size="sm"
            />
          </div>
          <div className="medium flex items-center justify-center gap-2">
            <Button
              variant="ghost"
              color="accent"
              text="primary ghost"
              size="md"
            />
            <Button
              variant="ghost"
              color="neutral"
              text="neutral ghost"
              size="md"
            />
          </div>
          <div className="large flex items-center justify-center gap-2">
            <Button
              variant="ghost"
              color="accent"
              text="primary ghost"
              size="lg"
            />
            <Button
              variant="ghost"
              color="neutral"
              text="neutral ghost"
              size="lg"
            />
          </div>
        </div>
      </div>
    </Section>
  );
}
