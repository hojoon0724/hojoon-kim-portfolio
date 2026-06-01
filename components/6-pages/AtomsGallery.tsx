import { Button, Section } from "@/components/1-atoms";

export function AtomsGallery() {
  return (
    <Section className="flex flex-col justify-center items-center w-full" fullWidth>
      <h1>Atoms</h1>
      <h2>Buttons</h2>
      <div className="flex flex-col justify-center items-center gap-8">
        <div className="sizes flex flex-col gap-4 items-start">
          <div className="small flex gap-2 justify-center items-center">
            <Button variant="filled" color="primary" text="primary filled" size="sm" />
            <Button variant="filled" color="secondary" text="secondary filled" size="sm" />
            <Button variant="filled" color="tertiary" text="tertiary filled" size="sm" />
          </div>
          <div className="medium flex gap-2 justify-center items-center">
            <Button variant="filled" color="primary" text="primary filled" size="md" />
            <Button variant="filled" color="secondary" text="secondary filled" size="md" />
            <Button variant="filled" color="tertiary" text="tertiary filled" size="md" />
          </div>
          <div className="large flex gap-2 justify-center items-center">
            <Button variant="filled" color="primary" text="primary filled" size="lg" />
            <Button variant="filled" color="secondary" text="secondary filled" size="lg" />
            <Button variant="filled" color="tertiary" text="tertiary filled" size="lg" />
          </div>
        </div>
        <div className="sizes flex flex-col gap-4 items-start">
          <div className="small flex gap-2 justify-center items-center">
            <Button variant="outline" color="primary" text="primary outline" size="sm" />
            <Button variant="outline" color="secondary" text="secondary outline" size="sm" />
            <Button variant="outline" color="tertiary" text="tertiary outline" size="sm" />
          </div>
          <div className="medium flex gap-2 justify-center items-center">
            <Button variant="outline" color="primary" text="primary outline" size="md" />
            <Button variant="outline" color="secondary" text="secondary outline" size="md" />
            <Button variant="outline" color="tertiary" text="tertiary outline" size="md" />
          </div>
          <div className="large flex gap-2 justify-center items-center">
            <Button variant="outline" color="primary" text="primary outline" size="lg" />
            <Button variant="outline" color="secondary" text="secondary outline" size="lg" />
            <Button variant="outline" color="tertiary" text="tertiary outline" size="lg" />
          </div>
        </div>
        <div className="sizes flex flex-col gap-4 items-start">
          <div className="small flex gap-2 justify-center items-center">
            <Button variant="ghost" color="primary" text="primary ghost" size="sm" />
            <Button variant="ghost" color="secondary" text="secondary ghost" size="sm" />
            <Button variant="ghost" color="tertiary" text="tertiary ghost" size="sm" />
          </div>
          <div className="medium flex gap-2 justify-center items-center">
            <Button variant="ghost" color="primary" text="primary ghost" size="md" />
            <Button variant="ghost" color="secondary" text="secondary ghost" size="md" />
            <Button variant="ghost" color="tertiary" text="tertiary ghost" size="md" />
          </div>
          <div className="large flex gap-2 justify-center items-center">
            <Button variant="ghost" color="primary" text="primary ghost" size="lg" />
            <Button variant="ghost" color="secondary" text="secondary ghost" size="lg" />
            <Button variant="ghost" color="tertiary" text="tertiary ghost" size="lg" />
          </div>
        </div>
      </div>
    </Section>
  );
}
