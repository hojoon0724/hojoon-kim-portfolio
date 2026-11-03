import { SOCIAL_ICONS } from "@/demos/moindi/data/social-icons";
import type { Socials } from "@/demos/moindi/types";

// a row of the user's filled-in social links, grayed out until hovered.
// only platforms with an icon in SOCIAL_ICONS show
export function SocialLinks({
  socials,
  className = "",
}: {
  socials: Socials;
  className?: string;
}) {
  const links = (Object.entries(socials) as [keyof Socials, string][]).filter(
    ([platform, url]) => url && SOCIAL_ICONS[platform],
  );
  if (links.length === 0) return null;

  return (
    <div
      className={`all-social-links-container flex w-full items-center justify-center gap-(--standard-space-half) ${className}`}
    >
      {links.map(([platform, url]) => (
        <a
          key={platform}
          className="social-link border-2"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={platform}
        >
          <div
            className="social-icon-container flex h-8 w-8 items-center justify-center opacity-75 saturate-0 transition-all duration-(--timing-default) hover:opacity-100 hover:saturate-100"
            // static icons from the demo's own data
            dangerouslySetInnerHTML={{ __html: SOCIAL_ICONS[platform]! }}
          />
        </a>
      ))}
    </div>
  );
}
