export interface ProjectOverviewData {
  id: string;
  name: string;
  description: string;
  logoFileName: string;
  backgroundClassName: string;
  textColorClassName: string;
  roleTag: string;
  role: string;
  categories: string[];
  heroImage: string;
}

export const projectOverviewData: ProjectOverviewData[] = [
  {
    id: "ensrq",
    name: "enSRQ",
    description:
      "A long-term visual and digital system for a contemporary music series, spanning brand evolution, seasonal identities, a public-facing website, and custom administrative tools.",
    logoFileName: "ensrq-logo-white-on-dark.png",
    backgroundClassName: "bg-teal-800",
    textColorClassName: "",
    roleTag: "Designer who builds operational systems",
    role: "Brand Designer & Developer",
    categories: ["Brand", "Campaigns", "Art Direction", "Print", "Web", "Code"],
    heroImage: "",
  },
  {
    id: "focus-features",
    name: "Focus Features",
    description:
      "Original footage for awards-season filmmaker and talent Q&As, delivered through a fully managed capture and secure media workflow.",
    logoFileName: "focus-logo-on-dark.png",
    backgroundClassName: "bg-gray-800",
    textColorClassName: "text-gray-100",
    roleTag: "End-to-end awards campaign video production",
    role: "Cinematographer & Producer",
    categories: [
      "Cinematography",
      "On-Set Production",
      "Camera Systems",
      "Technical Execution",
      "Media Management",
    ],
    heroImage: "",
  },
  {
    id: "laphil",
    name: "LA Phil",
    description:
      "Supporting live performance and audience-facing programs through media design, technical cueing, legacy-system problem solving, and bilingual artist communication.",
    logoFileName: "laphil-logo-white-on-dark.png",
    backgroundClassName: "bg-laphil-blue",
    textColorClassName: "text-gray-100",
    roleTag: "Live performance systems consultant",
    role: "Media Designer & Technical Consultant",
    categories: [
      "Motion Graphics",
      "Editorial",
      "Technology",
      "Lecture",
      "Translation",
    ],
    heroImage: "",
  },
  {
    id: "moindi",
    name: "MOindi",
    description:
      "Shaping an early-stage product from brand system to working interface, combining product design, frontend development, and close collaboration with the CTO.",
    logoFileName: "moindi-logo-dark-on-orange.png",
    backgroundClassName: "bg-moindi-orange",
    textColorClassName: "text-gray-950",
    roleTag: "Founding product, brand, and build lead",
    role: "Director of Brand & Product",
    categories: ["Brand", "Product", "Systems", "UX/UI", "Code"],
    heroImage: "",
  },
  {
    id: "rcnm",
    name: "Rocket City New Music",
    description:
      "Co-founding a contemporary music organization from the ground up, building its brand, audience experience, production systems, fundraising infrastructure, and live visual world.",
    logoFileName: "rcnm-logo-on-dark.png",
    backgroundClassName: "bg-rcnm-black-500",
    textColorClassName: "text-gray-100",
    roleTag: "0-to-1 founder and systems builder",
    role: "Co-Founder",
    categories: [
      "Brand",
      "Database Design",
      "Live Production",
      "Lighting Design",
      "Video Production",
    ],
    heroImage: "",
  },
];
