export interface ProjectOverviewData {
  id: string;
  name: string;
  description: string;
  logoFileName: string;
  backgroundClassName: string;
  textColorClassName: string;
  roleTag: string;
  categories: string[];
  heroImage: string;
  projectVitals?: { key: string; value: string }[];
  storyMd?: string;
  calloutMd?: string;
}

export const projectOverviewData: ProjectOverviewData[] = [
  
  {
    id: "moindi",
    name: "MOindi",
    description:
      "Shaping an early-stage product from brand system to working interface, combining product design, frontend development, and close collaboration with the CTO.",
    logoFileName: "moindi-logo-dark-on-orange.png",
    backgroundClassName: "bg-moindi-orange",
    textColorClassName: "text-gray-950",
    roleTag: "Founding product, brand, and build lead",

    categories: ["Brand", "Product", "Systems", "UX/UI", "Code"],
    heroImage: "",
    projectVitals: [
      {
        key: "What",
        value:
          "A platform that would allow independent artists to sell equity in their music directly to fans and investors",
      },
      { key: "Role", value: "Director of Brand & Product" },
      {
        key: "Goal",
        value:
          "Turn an early idea into a credible brand and working product for fundraising and private alpha",
      },
      {
        key: "Stage",
        value:
          "Early: no working product, established brand, or defined customer experience",
      },
    ],
    storyMd:
      "The founders came to me to build the brand and prepare the company to raise funding. The problem was, there was no product to brand yet, no working prototype, no market research, no customer journey, no product roadmap, and no clear definition of what the experience should be.\n\n**They needed a product first.**",
    calloutMd: "“The problem was, there was no product to brand yet.”",
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

    categories: [
      "Brand",
      "Database Design",
      "Live Production",
      "Lighting Design",
      "Video Production",
    ],
    heroImage: "",
    projectVitals: [
      {
        key: "What",
        value:
          "A contemporary classical music nonprofit built for immersive experiences",
      },
      {
        key: "Role",
        value: "Cofounder & Systems Builder",
      },
      {
        key: "Goal",
        value:
          "Build an organization and concert experience that made contemporary classical music feel engaging and accessible",
      },
    ],
    storyMd:
      "Classical concerts often assumed that the music could speak for itself. I believed that it doesn't have to. Why make it purposely boring and not take advantage of what other genres are doing? Contemporary Classical music could be presented like other mainstream concerts.\n\nBut there was one problem, there was no institution, team, brand, operating process, production playbook, or technical infrastructure, nothing. Not only did we have to produce the concerts, we had to build an entire organization's system from scratch.\n\n**The challenge was not simply putting on concerts. It was building the system that made them possible.**",
    calloutMd:
      "“The challenge was not simply putting on concerts. It was building the system that made them possible.”",
  },
  {
    id: "ensrq",
    name: "enSRQ",
    description:
      "A long-term visual and digital system for a contemporary music series, spanning brand evolution, seasonal identities, a public-facing website, and custom administrative tools.",
    logoFileName: "ensrq-logo-white-on-dark.png",
    backgroundClassName: "bg-teal-800",
    textColorClassName: "",
    roleTag: "Designer who builds operational systems",
    categories: ["Brand", "Campaigns", "Art Direction", "Print", "Web", "Code"],
    heroImage: "",
    projectVitals: [
      {
        key: "What",
        value:
          "A long-running contemporary classical music series that needed a recognizable public identity and a digital system that could support each new season.",
      },
      {
        key: "Role",
        value: "Brand Systems Designer & Builder",
      },
      {
        key: "Goal",
        value:
          "Build a recognizable identity that could evolve with the series and support each new season.",
      },
    ],
    storyMd:
      "enSRQ began as a small contemporary classical music series in Sarasota with a name but no cohesive identity, visual system, or scalable way to present its work to audiences. I was initially hired to create the brand, but the relationship grew as the organization did.\n\nOver time, every new concert season introduced the same challenge: how do you make each season feel fresh and artistically specific without losing recognition, rebuilding everything from scratch, or creating more administrative work for a small nonprofit team?\n\n**The answer could not be just a new look. It needed to become a system.**",
    calloutMd:
      "“The answer could not be just a new look. It needed to become a system.”",
  },
  {
    id: "focus-features",
    name: "Focus Features",
    description:
      "Original footage for awards-season filmmaker and talent Q&As, delivered through a fully managed capture and secure media workflow.",
    logoFileName: "focus-logo-on-dark.png",
    backgroundClassName: "bg-gray-800",
    textColorClassName: "text-white/90",
    roleTag: "End-to-end awards campaign video production",

    categories: [
      "Cinematography",
      "On-Set Production",
      "Camera Systems",
      "Technical Execution",
      "Media Management",
    ],
    heroImage: "",
    projectVitals: [
      {
        key: "What",
        value:
          "Original-footage capture for post-screening Q&As during awards season",
      },
      {
        key: "Role",
        value: "Independent Production & Technical Consultant",
      },
      {
        key: "Challenge",
        value: "Things can't go wrong and there is no second take.",
      },
      {
        key: "Goal",
        value:
          "Capture and securely deliver clean original footage from live, one-time awards-season Q&As.",
      },
    ],
    storyMd:
      "Awards-season Q&As are live, tightly scheduled, and cannot be recreated. The venue, timing, panel format, available lighting, and physical constraints can change from one event to the next, but the original footage still has to be captured cleanly and delivered securely for the campaign team.\n\nI am brought in to own that part of the process. With no second take and often no dedicated production crew, I need to assess the room, anticipate technical problems, build redundancy into the setup, and make the right decisions before the first guest walks onstage.\n\n**The work has to disappear when it is done well.**",
    calloutMd: "“The work has to disappear when it is done well.”",
  },
  {
    id: "laphil",
    name: "LA Phil",
    description:
      "Supporting live performance and audience-facing programs through media design, technical cueing, legacy-system problem solving, and bilingual artist communication.",
    logoFileName: "laphil-logo-white-on-dark.png",
    backgroundClassName: "bg-laphil-blue",
    textColorClassName: "text-white/90",
    roleTag: "Live performance systems consultant",

    categories: [
      "Motion Graphics",
      "Editorial",
      "Technology",
      "Lecture",
      "Translation",
    ],
    heroImage: "",
    projectVitals: [
      {
        key: "What",
        value:
          "A continuing set of specialized assignments for one of the country’s leading orchestras.",
      },
      {
        key: "Role",
        value: "Independent Consultant & Commissioned Artist",
      },
      {
        key: "Goal",
        value:
          "Make specialized live-performance projects work clearly, reliably, and meaningfully for audiences.",
      },
    ],
    storyMd:
      "The Los Angeles Philharmonic does not bring me in for one repeatable service. I am called when a project sits outside a standard job description: a live presentation needs a reliable cue system the day before a performance, a decades-old electronic component needs to work again, a concert needs visuals that respond to its music, or a program needs a speaker who can make unfamiliar work accessible across languages.\n\nThe assignments are different, but the expectation is the same: understand the problem quickly, figure out what is actually needed, and make it work in front of a live audience.\n\n**The brief changes. The responsibility does not.**",
    calloutMd: "“The brief changes. The responsibility does not.”",
  },
];
