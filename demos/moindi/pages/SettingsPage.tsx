import { SvgIcon } from "@/demos/moindi/components/SvgIcon";

// the original's settings menu. its sub-pages (edit profile, socials, appearance, account) aren't ported,
// so the rows are listed but don't lead anywhere yet
const SETTINGS_LINKS = [
  { icon: "user", label: "Edit Profile" },
  { icon: "link", label: "Link Social Media" },
  { icon: "lightbulb", label: "Appearance" },
  { icon: "lock", label: "Account Settings" },
];

export function SettingsPage() {
  return (
    <div className="flex h-full w-full flex-col p-(--standard-space)">
      <div className="space-mono mb-(--standard-space) uppercase">Settings</div>
      <ul className="flex flex-col gap-(--standard-space)">
        {SETTINGS_LINKS.map((link) => (
          <li
            key={link.label}
            className="space-grotesk flex w-full items-center justify-between border p-(--standard-space)"
          >
            <div className="flex items-center gap-(--standard-space)">
              <div className="h-8 w-8">
                <SvgIcon iconName={link.icon} />
              </div>
              <span>{link.label}</span>
            </div>
            <div className="h-8 w-8">
              <SvgIcon iconName="angle-right" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
