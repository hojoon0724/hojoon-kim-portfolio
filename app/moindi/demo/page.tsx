import {
  Button,
  RandomTiles,
  RedirectWhenLoggedIn,
} from "@/demos/moindi/components";

export default function MoindiDemoPage() {
  return (
    <div className="moindi-demo-top-container bg-primary-500 relative flex w-full flex-1">
      <RedirectWhenLoggedIn to="/moindi/demo/home" />
      <div className="random-tiles-container absolute inset-0 overflow-hidden">
        <RandomTiles />
      </div>
      <div className="random-tiles-overlay absolute inset-0 bg-black opacity-40"></div>
      <div className="content-container absolute inset-0 flex h-full flex-col items-center justify-center p-4">
        <div className="card z-10 mx-auto flex max-w-100 flex-col items-center justify-center border-4 border-neutral-700 bg-neutral-300 p-4 text-center drop-shadow-2xl animation-slide-in">
          <div className="bg-primary-500 space-mono w-full px-4 text-center text-3xl font-bold uppercase">
            This is a demo
          </div>
          <div className="disclaimer-container mt-4 flex w-full flex-col justify-between gap-4 border-t border-black pt-4">
            <p>
              This is a working recreation of MOindi, rebuilt for this
              portfolio. It isn’t connected to anything. The artists are
              fictional, everything stays in your browser, and when you close
              the tab, it’s all gone.
            </p>
            <p>
              But it works. I’ve given you $100k of very real fake money and a
              simulation to play in. Invest wisely.
            </p>
          </div>
          <div className="easter-eggs-container mt-4 flex w-full flex-col justify-between gap-4 border-t border-black pt-4">
            <p className="text-center">
              There may or may not be easter eggs.
              <br />
              <span className="text-xs">(There are.)</span>
            </p>

            <div className="button-container">
              <Button size="small">Continue</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
