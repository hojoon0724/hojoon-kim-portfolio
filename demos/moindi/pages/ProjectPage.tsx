"use client";

import { BackButton } from "@/demos/moindi/components/BackButton";
import { Button } from "@/demos/moindi/components/Button";
import { CollapsibleParagraph } from "@/demos/moindi/components/CollapsibleParagraph";
import { useDemoAuth } from "@/demos/moindi/components/DemoAuthProvider";
import { ImageContainer } from "@/demos/moindi/components/ImageContainer";
import { ProjectHeader } from "@/demos/moindi/components/ProjectHeader";
import { PurchaseSharesCalculator } from "@/demos/moindi/components/PurchaseSharesCalculator";
import { SlashTexture } from "@/demos/moindi/components/SlashTexture";
import { UserBadge } from "@/demos/moindi/components/UserBadge";
import { recentBackers } from "@/demos/moindi/data/backers";
import { formatCurrency } from "@/demos/moindi/lib/format";
import type { ProjectInterface } from "@/demos/moindi/types";

// adds the id if it's missing, removes it if it's there
function toggle(list: string[], id: string) {
  return list.includes(id) ? list.filter((item) => item !== id) : [...list, id];
}

// the original's view-project: the title and countdown, cover, description and favorite button, the artist
// and goal, the share calculator, then the recent backers
export function ProjectPage({ project }: { project: ProjectInterface }) {
  const { user, updateUser } = useDemoAuth();
  if (!user) return null;

  const isFavorite = user.favorites.includes(project.id);
  const isOwnProject = project.creatorId === user.id;
  const backers = recentBackers(project);

  return (
    <div className="project-page flex w-full min-w-0 flex-col gap-(--standard-space) p-(--standard-space)">
      <div className="flex">
        <BackButton />
      </div>

      <div className="flex flex-col">
        <div className="current-project-block mx-auto grid w-full grid-cols-1 border">
          <ProjectHeader title={project.title} endDate={project.endDate} />

          <div className="grid w-full grid-cols-1 md:grid-cols-5">
            <div className="flex h-full flex-col justify-between border p-(--standard-space) md:col-span-2">
              <ImageContainer
                srcSet={project.heroSrcSet}
                description={`${project.title} album cover`}
              />
            </div>

            <div className="flex h-full w-full flex-col justify-between md:col-span-3">
              <div className="flex h-full flex-col justify-between gap-(--standard-space) border p-(--standard-space)">
                <CollapsibleParagraph maxLines={5}>
                  <p>{project.description}</p>
                </CollapsibleParagraph>
                <div className="flex justify-start">
                  <Button
                    variant="outline"
                    size="small"
                    color={isFavorite ? "tertiary" : "primary"}
                    iconName={isFavorite ? "heart" : "heart-o"}
                    aria-pressed={isFavorite}
                    onClick={() =>
                      updateUser((u) => ({
                        ...u,
                        favorites: toggle(u.favorites, project.id),
                      }))
                    }
                  >
                    {isFavorite ? "Remove Favorite" : "Favorite"}
                  </Button>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row">
                <div className="grow border p-(--standard-space)">
                  <UserBadge
                    size="large"
                    userId={project.creatorId}
                    userName={project.creatorInfo.displayName}
                    userImageSrcSet={project.creatorInfo.profileSrcSet}
                    isFollowing={user.following.includes(project.creatorId)}
                    onToggleFollow={
                      isOwnProject
                        ? undefined
                        : (id) =>
                            updateUser((u) => ({
                              ...u,
                              following: toggle(u.following, id),
                            }))
                    }
                  />
                </div>
                <div className="flex items-center justify-center border p-(--standard-space) whitespace-nowrap">
                  <div className="space-grotesk flex items-center justify-center gap-[1ch] opacity-60 lg:flex-col">
                    <div>Goal:</div>
                    <div className="space-mono">
                      {formatCurrency(project.projectGoal)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-full border p-(--standard-space)">
            <PurchaseSharesCalculator project={project} />
          </div>
        </div>

        <div className="relative my-4 h-4 w-full">
          <SlashTexture />
        </div>

        {backers.length > 0 && (
          <div className="backers-container border">
            <div className="flex w-full items-center justify-start border p-(--standard-space-half)">
              <h5 className="text-left mb-0!">Recent Backers</h5>
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-(--standard-space-half) border p-(--standard-space-half)">
              {backers.map((backer) => (
                <UserBadge
                  key={backer.id}
                  size="small"
                  userId={backer.id}
                  userName={backer.name}
                  userImageSrcSet={backer.photoSrc}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
