"use client";

import { Button } from "@/demos/moindi/components/Button";
import { useDemoAuth } from "@/demos/moindi/components/DemoAuthProvider";
import { SvgIcon } from "@/demos/moindi/components/SvgIcon";
import { UserProfileHeader } from "@/demos/moindi/components/UserProfileHeader";
import { moindiDemoProjects } from "@/demos/moindi/data/projects";
import { moindiDemoReleases } from "@/demos/moindi/data/releases";
import { useRouter } from "next/navigation";
import { CurrentProjectBlock } from "../components/CurrentProjectBlock";
import { ReleaseTile } from "../components/ReleaseTile";
import { TabMenu } from "../components/TabMenu";
import { useDemoStorage } from "../hooks/use-demo-storage";

const profileTabs = ["releases", "products", "projects"] as const;
type ProfileTab = (typeof profileTabs)[number];

// the visitor's own profile, from the original's view-user page. the artist tabs are trimmed to
// releases, products and projects (playlist dropped). only releases has data so far
export function ProfilePage() {
  const { user } = useDemoAuth();
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useDemoStorage<ProfileTab>(
    "profile-tab",
    "releases",
  );
  if (!user) return null;

  const currentProject = moindiDemoProjects.find(
    (project) => project.id === user.currentProject,
  );
  const releases = moindiDemoReleases.filter(
    (release) => release.artistId === user.id,
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
          color="secondary"
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
      <div className="tab-menu-content-container">
        <TabMenu
          size="small"
          bottomBorder={false}
          options={profileTabs}
          activeOption={selectedTab}
          onSelect={setSelectedTab}
        />
        <div className="profile-tab-content-container relative z-20">
          <div className="grid min-h-48 max-w-full grid-cols-1 border md:grid-cols-2">
            {selectedTab === "releases" && releases.length > 0 ? (
              releases.map((release) => (
                <ReleaseTile
                  key={release.id}
                  className="w-full max-w-full"
                  release={release}
                />
              ))
            ) : (
              <div className="flex h-full w-full items-center justify-center md:col-span-2">
                <div className="space-grotesk opacity-70">
                  No {selectedTab} available
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
