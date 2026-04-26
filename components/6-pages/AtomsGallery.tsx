import { Button, Section } from "@/components/1-atoms";

export function AtomsGallery() {
  return (
    <Section className="flex flex-col justify-center items-center w-full" fullWidth>
      <h1>Atoms</h1>
      <h2>Buttons</h2>
      <div className="flex flex-col justify-center items-center gap-4">
        <div className="sizes flex gap-4">
          <div className="small flex gap-2 justify-center items-center">
            <Button variant="filled" color="accent" text="accent filled" size="sm" />
            <Button variant="filled" color="secondary" text="Secondary filled" size="sm" />
          </div>
          <div className="medium flex gap-2 justify-center items-center">
            <Button variant="filled" color="accent" text="accent filled" size="md" />
            <Button variant="filled" color="secondary" text="Secondary filled" size="md" />
          </div>
          <div className="large flex gap-2 justify-center items-center">
            <Button variant="filled" color="accent" text="accent filled" size="lg" />
            <Button variant="filled" color="secondary" text="Secondary filled" size="lg" />
          </div>
        </div>
        <div className="sizes flex gap-4">
          <div className="small flex gap-2 justify-center items-center">
            <Button variant="outline" color="accent" text="accent outline" size="sm" />
            <Button variant="outline" color="secondary" text="Secondary outline" size="sm" />
          </div>
          <div className="medium flex gap-2 justify-center items-center">
            <Button variant="outline" color="accent" text="accent outline" size="md" />
            <Button variant="outline" color="secondary" text="Secondary outline" size="md" />
          </div>
          <div className="large flex gap-2 justify-center items-center">
            <Button variant="outline" color="accent" text="accent outline" size="lg" />
            <Button variant="outline" color="secondary" text="Secondary outline" size="lg" />
          </div>
        </div>
        <div className="sizes flex gap-4">
          <div className="small flex gap-2 justify-center items-center">
            <Button variant="ghost" color="accent" text="accent ghost" size="sm" />
            <Button variant="ghost" color="secondary" text="Secondary ghost" size="sm" />
          </div>
          <div className="medium flex gap-2 justify-center items-center">
            <Button variant="ghost" color="accent" text="accent ghost" size="md" />
            <Button variant="ghost" color="secondary" text="Secondary ghost" size="md" />
          </div>
          <div className="large flex gap-2 justify-center items-center">
            <Button variant="ghost" color="accent" text="accent ghost" size="lg" />
            <Button variant="ghost" color="secondary" text="Secondary ghost" size="lg" />
          </div>
        </div>
      </div>
    </Section>
  );
}
