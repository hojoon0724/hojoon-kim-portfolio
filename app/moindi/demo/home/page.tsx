import { RequireDemoLogin } from "@/demos/moindi/components";

export default function MoindiDemoHome() {
  return (
    <RequireDemoLogin redirectTo="/moindi/demo">
      <div>Home</div>
    </RequireDemoLogin>
  );
}
