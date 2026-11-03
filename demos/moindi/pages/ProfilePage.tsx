"use client";

import { Button } from "@/demos/moindi/components/Button";
import { useDemoAuth } from "@/demos/moindi/components/DemoAuthProvider";
import { SvgIcon } from "@/demos/moindi/components/SvgIcon";
import { UserProfileHeader } from "@/demos/moindi/components/UserProfileHeader";
import { moindiDemoProjects } from "@/demos/moindi/data/projects";
import { useRouter } from "next/navigation";
import { CurrentProjectBlock } from "../components/CurrentProjectBlock";

// the visitor's own profile, from the original's view-user page. the artist tabs (releases, products,
// playlist, rounds) aren't ported, since the visitor isn't an artist
export function ProfilePage() {
  const { user } = useDemoAuth();
  const router = useRouter();
  if (!user) return null;

  const currentProject = moindiDemoProjects.find(
    (project) => project.id === user.currentProject,
  );

  return (
    <div className="flex w-full flex-col gap-(--standard-space) p-(--standard-space)">
      <div className="flex items-center justify-between">
        <button
          type="button"
          className="flex items-center gap-1 pl-2 transition-all hover:pl-0"
          onClick={() => router.back()}
        >
          <div className="h-8 w-8">
            <SvgIcon iconName="arrow-left" />
          </div>
          <span className="space-mono font-bold uppercase">Back</span>
        </button>
        <Button
          size="tiny"
          color="primary"
          onClick={() => router.push("/moindi/demo/settings")}
        >
          Edit Profile
        </Button>
      </div>
      <UserProfileHeader user={user} />
      {currentProject && (
        <CurrentProjectBlock
          className="z-10 bg-(--surface-base)"
          project={currentProject}
        />
      )}
    </div>
  );
}
