import { Button, Section } from "@/components/1-atoms";

export function AtomsGallery() {
  return (
    <Section className="flex flex-col justify-center items-center w-full" fullWidth>
      <h1>Atoms</h1>
      <h2>Buttons</h2>
      <div className="flex flex-col justify-center items-center gap-4">
        <div className="sizes flex gap-4">
          <div className="small flex gap-2 justify-center items-center">
            <Button variant="filled" color="accent" text="accent filled" size="small" />
            <Button variant="filled" color="secondary" text="Secondary filled" size="small" />
          </div>
          <div className="medium flex gap-2 justify-center items-center">
            <Button variant="filled" color="accent" text="accent filled" size="medium" />
            <Button variant="filled" color="secondary" text="Secondary filled" size="medium" />
          </div>
          <div className="large flex gap-2 justify-center items-center">
            <Button variant="filled" color="accent" text="accent filled" size="large" />
            <Button variant="filled" color="secondary" text="Secondary filled" size="large" />
          </div>
        </div>
        <div className="sizes flex gap-4">
          <div className="small flex gap-2 justify-center items-center">
            <Button variant="outline" color="accent" text="accent outline" size="small" />
            <Button variant="outline" color="secondary" text="Secondary outline" size="small" />
          </div>
          <div className="medium flex gap-2 justify-center items-center">
            <Button variant="outline" color="accent" text="accent outline" size="medium" />
            <Button variant="outline" color="secondary" text="Secondary outline" size="medium" />
          </div>
          <div className="large flex gap-2 justify-center items-center">
            <Button variant="outline" color="accent" text="accent outline" size="large" />
            <Button variant="outline" color="secondary" text="Secondary outline" size="large" />
          </div>
        </div>
        <div className="sizes flex gap-4">
          <div className="small flex gap-2 justify-center items-center">
            <Button variant="ghost" color="accent" text="accent ghost" size="small" />
            <Button variant="ghost" color="secondary" text="Secondary ghost" size="small" />
          </div>
          <div className="medium flex gap-2 justify-center items-center">
            <Button variant="ghost" color="accent" text="accent ghost" size="medium" />
            <Button variant="ghost" color="secondary" text="Secondary ghost" size="medium" />
          </div>
          <div className="large flex gap-2 justify-center items-center">
            <Button variant="ghost" color="accent" text="accent ghost" size="large" />
            <Button variant="ghost" color="secondary" text="Secondary ghost" size="large" />
          </div>
        </div>
      </div>
    </Section>
  );
}
