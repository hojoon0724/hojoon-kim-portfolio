import { TimelineScroll } from "@/components/4-organisms";

const focusFeaturesSections = {
  section: {
    eyebrow: "Focus Features · Production timeline",
    title: "The production system",
    intro:
      "The same process on every shoot, refined over years of Q&As for Focus Features, from the brief to the secured footage.",
    timingNote:
      "T is the moment the Q&A starts and recording begins, usually about two hours into the screening. The brief arrives anywhere from two weeks to five days out, so the early markers are typical, not fixed. The schedule compresses to fit; the steps don't change.",
    closing:
      "The equipment is accounted for, the media is secured, and the production is complete.",
  },
  phases: [
    {
      id: "pre",
      label: "Pre-production",
      steps: ["brief", "research", "site-visit", "gear-list"],
    },
    {
      id: "prep",
      label: "Day before",
      steps: ["prepare", "pack"],
    },
    {
      id: "show",
      label: "Day of",
      steps: ["arrival", "verify", "talent-audio", "record"],
    },
    {
      id: "wrap",
      label: "Wrap",
      steps: ["secure", "strike"],
    },
    {
      id: "close",
      label: "Close-out",
      steps: ["reset", "return"],
    },
  ],
  steps: [
    {
      id: "brief",
      number: "01",
      marker: "~T−1w",
      label: "Brief",
      title: "Production brief",
      text: "Confirm the screening, venue, Q&A format, number of participants, schedule, and audio requirements. The delivery specs (resolution, frame rate, codec, color profile, and audio format) are a standard set once and carried across every shoot, so the footage matches from one Q&A to the next.",
      intendedEffect:
        "Every shoot starts from the same technical standard, so the brief only has to cover what's new.",
      extraDetails: [],
      media: [],
    },
    {
      id: "research",
      number: "02",
      marker: "~T−3d",
      label: "Research",
      title: "Venue research",
      text: "Study the venue, floorplans, previous events, and available reference footage. Develop a preliminary plan for camera placement and coverage before the site visit.",
      intendedEffect:
        "Arrive at the venue with a plan to test, not a blank page.",
      extraDetails: [
        "Note the screen position and house-light behavior, since the Q&A starts the moment the film ends and the room changes fast.",
      ],
      media: [],
    },
    {
      id: "site-visit",
      number: "03",
      marker: "~T−3d",
      label: "Site visit",
      title: "Site visit and framing",
      text: "When access allows, test the plan in the room itself. Check camera positions, sightlines, stage lighting, exposure, power, and audio connections, and capture reference frames for client approval. What the room shows here decides which lenses and bodies the shoot needs.",
      intendedEffect:
        "Replace assumptions about the room with facts, and let those facts drive the gear.",
      extraDetails: [
        "Keep the reference frames and exposure settings as a record, so show day starts from known values instead of guesses.",
        "Find the nearest power for each camera position, and plan for battery power where there isn't any.",
      ],
      media: [],
    },
    {
      id: "gear-list",
      number: "04",
      marker: "~T−3d",
      label: "Procure",
      title: "Camera package",
      text: "Build the gear list from what the site visit showed. The core package stays consistent from shoot to shoot; the lenses and camera bodies change to fit the room. Then reserve the package from rental suppliers.",
      intendedEffect: "The gear follows the room, not habit.",
      extraDetails: [
        "Include spares for anything the night depends on: batteries, media, and cables.",
      ],
      media: [],
    },
    {
      id: "prepare",
      number: "05",
      marker: "T−1d",
      label: "Prepare",
      title: "Pickup and checkout",
      text: "Pick up the rental package and put every piece through its paces: lenses, sensors, batteries, support gear, cables, audio devices, and SSDs. Load my saved camera profile onto every body so they all match, run test recordings, and confirm the drives record continuously. Everything is confirmed working before it leaves the table.",
      intendedEffect:
        "Show day starts with equipment that's already been proven.",
      extraDetails: [
        "Sync the clocks on every camera so the angles line up in the edit.",
        "Charge every battery overnight and format the media in-camera.",
      ],
      media: [],
    },
    {
      id: "pack",
      number: "06",
      marker: "T−1d",
      label: "Pack",
      title: "Repack for one person",
      text: "Rental gear arrives in individual cases, which would add up to ten to fifteen Pelican cases. That isn't something one person can move through a theater. So everything is repacked into a compact carrying setup, with cameras and drives labeled and the backups and essentials packed alongside.",
      intendedEffect:
        "The setup is designed to be carried and deployed by one person.",
      extraDetails: [],
      media: [],
    },
    {
      id: "arrival",
      number: "07",
      marker: "T−6h",
      label: "Arrival",
      title: "On-site setup",
      text: "Arrive four hours before the screening, half an hour ahead of call time, and go straight into assembly: drives and accessories onto the camera cages, batteries in, cables connected, bodies mounted to the tripods. Then each camera goes into its planned position.",
      intendedEffect:
        "Enough margin that a problem on arrival is an inconvenience, not a crisis.",
      extraDetails: ["Tape down every cable run before the audience arrives."],
      media: [],
    },
    {
      id: "verify",
      number: "08",
      marker: "T−4h",
      label: "Verify",
      title: "Technical checks",
      text: "With the cameras in place, set white balance and exposure for the room as it actually looks tonight, and confirm storage and power. When the venue provides an audio feed, it goes straight into the camera's XLR input and the levels are checked. Setup is complete about two hours to ninety minutes before the screening, with every camera ready to record at the press of a button.",
      intendedEffect:
        "Ready early, with nothing left to check once the film ends.",
      extraDetails: [
        "Record a short test clip on every camera and play it back, with audio, before calling it ready.",
      ],
      media: [],
    },
    {
      id: "talent-audio",
      number: "09",
      marker: "~T−20m",
      label: "Optional",
      title: "Talent audio",
      text: "When the venue cannot provide a suitable feed, mic the participants and verify the signal and recording levels before the Q&A.",
      intendedEffect:
        "A fallback planned in advance, so a weak house feed doesn't cost the night.",
      extraDetails: [],
      media: [],
    },
    {
      id: "record",
      number: "10",
      marker: "T−0",
      label: "Record",
      title: "Live capture",
      text: "Start recording before the credits finish. Monitor exposure and audio throughout the Q&A, anticipate conversational shifts, and operate the cameras to capture the moments as they happen.",
      intendedEffect: "All the preparation exists for this window.",
      extraDetails: [],
      media: [],
    },
    {
      id: "secure",
      number: "11",
      marker: "~T+1h",
      label: "Secure",
      title: "Media backup and handoff",
      text: "The moment the Q&A ends, recording stops and every drive comes off the cameras. At a single station, the footage is copied first to my own backup SSD, which is faster than the recording drives, so the footage is off the camera media and in a second location as quickly as possible. From there it goes to the client's drives, one or two at a time depending on where the footage is headed, with every copy verified by checksum.",
      intendedEffect:
        "The footage exists in more than one verified place before anyone leaves the building.",
      extraDetails: [
        "Use the same folder and file naming structure on every shoot, so any camera's footage can be found without asking.",
      ],
      media: [],
    },
    {
      id: "strike",
      number: "12",
      marker: "~T+1h",
      label: "Strike",
      title: "Breakdown",
      text: "While the client copies run, the cameras come down. Everything goes back into my compact carrying case and every item is accounted for. Breakdown and transfer finish together, and that's the last thing that happens on site.",
      intendedEffect:
        "Two jobs run in parallel, so the wrap takes as long as the copy and no longer.",
      extraDetails: [],
      media: [],
    },
    {
      id: "reset",
      number: "13",
      marker: "~T+3h",
      label: "Reset",
      title: "Sanitize and repack",
      text: "Back at base, the recording drives are sanitized so previously captured footage can't be recovered. Then the gear moves out of my carrying case and back into its original rental cases, ready to return.",
      intendedEffect: "Unreleased footage leaves only through the handoff.",
      extraDetails: [],
      media: [],
    },
    {
      id: "return",
      number: "14",
      marker: "T+1d",
      label: "Return",
      title: "Gear return",
      text: "Return the rental package to the suppliers. The equipment is accounted for, the media is secured, and the production is complete.",
      intendedEffect: "The job ends cleanly, with nothing left open.",
      extraDetails: [
        "Check each item against the rental list and flag any issues before handing it back.",
      ],
      media: [],
    },
  ],
};

export default function FocusFeaturesPage() {
  return (
    <TimelineScroll
      projectId="focus-features"
      section={focusFeaturesSections.section}
      phases={focusFeaturesSections.phases}
      steps={focusFeaturesSections.steps}
    />
  );
}
