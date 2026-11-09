"use client";

import { useState } from "react";
import { visualHeight } from "./frame";

// the scales from the guidelines, by the product's own tokens
const scales = [
  {
    name: "Primary",
    note: "Reduced range, and the hue shifts along it",
    steps: [300, 350, 400, 450, 500, 550, 600, 650, 700],
    token: "primary",
  },
  {
    name: "Secondary",
    note: "Hue 200°",
    steps: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    token: "secondary",
  },
  {
    name: "Gray",
    note: "Tinted toward the secondary. 30 and 970 replace white and black",
    steps: [30, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950, 970],
    token: "gray",
  },
  {
    name: "Functional",
    note: "Only for system states",
    steps: ["success", "warning", "error", "info"],
    token: null,
  },
] as const;

// what each role does in a layout, in the order the guidelines give the hierarchy
const roles = [
  { id: "base", label: "Base", rule: "The background." },
  { id: "grays", label: "Grays", rule: "Different grays show hierarchy." },
  {
    id: "secondary",
    label: "Secondary",
    rule: "The go-to color in most cases.",
  },
  {
    id: "primary",
    label: "Primary",
    rule: "Reserved for the one thing that matters right now.",
  },
] as const;

type RoleId = (typeof roles)[number]["id"];

const swatch = (token: string | null, step: string | number) =>
  token ? `var(--moindi-${token}-${step})` : `var(--moindi-${step}-500)`;

// the palette, and a small card built by its rules: boxes in a box, 90° corners, one subtle border color, and
// orange only on the button. pick a role to see where it's used
export function ColorRoles() {
  const [roleId, setRoleId] = useState<RoleId>("primary");
  // outlines the parts of the card that play the picked role
  const ring = (role: RoleId) =>
    roleId === role
      ? "outline-2 outline-offset-2 outline-dashed outline-(--moindi-primary-500)"
      : "";

  return (
    <div
      className={`gap-md p-md md:p-lg grid grid-cols-1 overflow-y-auto bg-(--moindi-gray-950) text-(--moindi-gray-50) md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] ${visualHeight}`}
    >
      <div className="gap-sm flex flex-col justify-center">
        {scales.map((scale) => (
          <div key={scale.name} className="flex flex-col gap-1">
            <div className="roboto-mono flex flex-wrap items-baseline justify-between gap-x-2 text-xs">
              <span className="font-bold uppercase">{scale.name}</span>
              <span className="opacity-60">{scale.note}</span>
            </div>
            <div className="flex h-7 md:h-9">
              {scale.steps.map((step) => (
                <div
                  key={step}
                  className="flex-1"
                  style={{ backgroundColor: swatch(scale.token, step) }}
                  title={scale.token ? `${scale.token} ${step}` : String(step)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="gap-sm flex flex-col justify-center">
        <div
          className="gap-xs flex flex-wrap"
          role="group"
          aria-label="Color role"
        >
          {roles.map((role) => (
            <button
              key={role.id}
              type="button"
              aria-pressed={role.id === roleId}
              onClick={() => setRoleId(role.id)}
              className={`roboto-mono px-sm py-xs cursor-pointer border border-current text-xs font-bold uppercase transition-colors md:text-sm ${role.id === roleId ? "bg-current/20" : "hover:bg-current/10"}`}
            >
              {role.label}
            </button>
          ))}
        </div>
        <p className="text-sm" aria-live="polite">
          {roles.find((role) => role.id === roleId)?.rule}
        </p>

        {/* the card, in the product's light theme */}
        <div
          className={`p-sm flex flex-col gap-2 border border-(--moindi-gray-200) bg-(--moindi-gray-50) text-(--moindi-gray-950) ${ring("base")}`}
          aria-hidden="true"
        >
          <div className={`grid grid-cols-2 gap-2 ${ring("grays")}`}>
            <div className="border border-(--moindi-gray-200) p-2">
              <div className="roboto-mono text-[10px] text-(--moindi-gray-500)">
                RAISED
              </div>
              <div className="roboto-mono text-lg font-bold">$48,200</div>
            </div>
            <div className="border border-(--moindi-gray-200) p-2">
              <div className="roboto-mono text-[10px] text-(--moindi-gray-500)">
                BACKERS
              </div>
              <div className="roboto-mono text-lg font-bold">312</div>
            </div>
          </div>
          <div className={`flex gap-1 ${ring("secondary")}`}>
            {["Indie", "Live"].map((tag) => (
              <span
                key={tag}
                className="roboto-mono bg-(--moindi-secondary-100) px-1.5 text-[10px] text-(--moindi-secondary-700)"
              >
                {tag}
              </span>
            ))}
          </div>
          <div
            className={`roboto-mono border border-(--moindi-gray-950) bg-(--moindi-primary-500) py-1.5 text-center text-xs font-bold ${ring("primary")}`}
          >
            INVEST
          </div>
        </div>
      </div>
    </div>
  );
}
