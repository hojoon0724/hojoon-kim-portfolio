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
        key: "Role",
        value: "Brand Systems Designer & Builder",
      },
      {
        key: "Profile",
        value:
          "An early-stage platform that would allow independent artists to sell equity in their music directly to fans and investors",
      },
      {
        key: "Goal",
        value:
          "Turn an early idea into a credible brand and working product for fundraising and private alpha",
      },
    ],
    storyMd:
      "## The Story\n\nThe founders came to me to build the brand and prepare the company to raise funding. The problem was, there was no product to brand yet, no working prototype, no market research, no customer journey, no product roadmap, and no clear definition of what the experience should be.\n\n**They needed a product first.**",
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
        key: "Role",
        value: "Cofounder & Systems Builder",
      },
      {
        key: "Profile",
        value:
          "A contemporary classical music nonprofit in Huntsville, AL that pairs new music with immersive lighting, video projection, and live production",
      },
      {
        key: "Goal",
        value:
          "Build the brand, systems, and production infrastructure needed to take a new organization from idea to functioning concert series",
      },
    ],
    storyMd:
      "## The Story\n\nRocket City New Music started with a shared idea: present contemporary classical music in a way that felt immersive, engaging, and worth coming back for.\n\nBut an idea for a concert series is not an organization. There was no brand, no website, no audience, no operational system, no production infrastructure, no financial records, no fundraising materials, and no established way to turn programming into a finished live experience.\n\nMy cofounder handled artistic programming and artist relationships. I had to build much of the rest.\n\n**This is what it took to turn an idea into a working organization**",
    calloutMd:
      "“The challenge was not simply putting on concerts. It was building the systems that made them possible.”",
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
        key: "Role",
        value: "Brand Systems Designer & Builder",
      },
      {
        key: "Profile",
        value:
          "A contemporary classical music series based in Sarasota, FL started by artistic directors George Nickson and Samantha Bennett.",
      },
      {
        key: "Goal",
        value:
          "Create a lasting brand identity, keep it consistent while making each season feel fresh, and build new systems as the organization grew",
      },
    ],
    storyMd:
      "## The Story\n\nenSRQ began as a small contemporary classical music series in Sarasota with a name, but no cohesive identity, visual system, or reliable way to present its work to audiences.\n\nI was initially hired to create the brand. But the work came with an ongoing contradiction: every season needed a new look that reflected its own programming and personality, while the organization still needed to feel recognizable from one year to the next.\n\nAs the series grew, the visual system had to do more than hold those two ideas together. It also had to support an expanding set of audience-facing materials and the information behind them.\n\n**This is how I made that work for eight seasons and counting.**",
    calloutMd:
      "“How do you keep a brand recognizable without making every season look the same?”",
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
        key: "Role",
        value: "Independent Production & Technical Consultant",
      },
      {
        key: "Profile",
        value:
          "An independent film studio known for being a major player every Oscar season",
      },
      {
        key: "Goal",
        value:
          "Independently capture, safeguard, and deliver usable original footage from live Q&As with no opportunity for retakes",
      },
    ],
    storyMd:
      "## The Story\n\nAwards-season Q&As are live, tightly scheduled, and cannot be recreated. The venue, timing, panel format, available lighting, and physical constraints can change from one event to the next, but the original footage still has to be captured cleanly and delivered securely for the campaign team.\n\nI am brought in to own that part of the process. There is no second take and no large production crew behind me. I need to assess the venue, pick the right gear, anticipate technical problems, build redundancy into the setup, and deliver no matter what.\n\n**This is how I make sure a one-time event is captured perfectly.**",
    calloutMd: "“There is no second take.”",
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
        key: "Role",
        value: "Independent Consultant & Commissioned Artist",
      },
      {
        key: "Profile",
        value:
          "A major performing-arts institution producing live orchestral experiences at the highest level",
      },
      {
        key: "Goal",
        value:
          "Handle specialized creative and technical needs quickly, efficiently, and at the standard of a live performance institution",
      },
    ],
    storyMd:
      "## The Story\n\nThe Los Angeles Philharmonic does not bring me in for one repeatable service. I am called when a project sits outside a standard job description: a live presentation needs a reliable cue system the day before a performance, a decades-old electronic component needs to work again, a concert needs visuals that respond to its music, or a program needs a speaker who can make unfamiliar work accessible across languages.\n\nThe assignments are different, but the expectation is the same: understand the problem quickly, figure out what is actually needed, and make it work in front of a live audience.\n\n**Here are a few of the problems I was brought in to solve.**",
    calloutMd: "“The brief changes. The responsibility does not.”",
  },
];
