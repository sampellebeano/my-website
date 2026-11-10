export interface PersonalProject {
  id: string;
  title: string;
  href?: string;
  icon?: string;
  context: string;
  status?: string;
  summary: string;
  paragraphs: string[];
  keywords?: string;
  screenshot?: {
    src: string;
    poster: string;
    alt: string;
    caption: string;
    width: number;
    height: number;
  };
}

// Personal builds live here. Employer initiatives belong to the career records.
export const projects: PersonalProject[] = [
  {
    id: "bassh",
    title: "bassh",
    href: "/bassh",
    icon: "/bassh/icon.png",
    context: "Personal project · iPhone & Mac",
    status: "Private testing",
    summary: "My Mac’s terminal on my iPhone. Tools, scripts and Git stay on the Mac; SSH connects the two.",
    paragraphs: [
      "I’m building bassh so I can use my Mac’s shell from my iPhone. Tools, scripts and Git run on the Mac, with SSH connecting the two.",
      "Saved connections and multiple sessions make it easier to pick up where I left off. Escape, Tab, Control and the arrow keys sit alongside the iPhone keyboard, where they’re actually useful.",
      "The Mac companion guides you through Tailscale and Remote Login, authorising your iPhone’s SSH key and checking the Mac’s host fingerprint.",
      "The Mac companion supports macOS 15 or later on Apple Silicon and Intel. The iPhone app is still in private testing. App downloads aren’t currently available from this site; the project page includes a setup guide for existing testers and an email link for release updates.",
    ],
    keywords: "terminal SSH remote access development tools Tailscale TestFlight Mac companion preview",
    screenshot: {
      src: "/images/apps/bassh-demo.gif",
      poster: "/images/apps/bassh-demo-poster.png",
      alt: "A recording of bassh running shell commands over SSH in a disposable Mac demo project.",
      caption: "Run your Mac’s tools from your iPhone.",
      width: 402,
      height: 874,
    },
  },
  {
    id: "ryw",
    title: "RYW",
    context: "Personal project · iPhone",
    status: "In development",
    summary: "Run Your World: a running map built from your recorded routes, with recent runs and a closer look at each one.",
    paragraphs: [
      "I’m building Run Your World (RYW) to turn running history into a personal map of the places I’ve explored.",
      "The iPhone app brings recorded routes, recent runs and run details together on a native map. Apple Health is the first integration, with running history stored on the device.",
      "It’s still in development. The current app shows original GPS routes; road and path matching, street coverage and repeat-visit colouring are work in progress.",
    ],
    keywords: "running map fitness workouts GPS routes Apple Health HealthKit Run Your World RYW",
  },
  {
    id: "kapture",
    title: "Kapture",
    icon: "/images/apps/kapture-icon.png",
    context: "Personal project · iOS & web",
    status: "In development",
    summary: "A marketplace to help clients find creators and manage the work together.",
    paragraphs: [
      "I’m building Kapture to connect clients with creators, with an iOS app and a website for creator discovery.",
      "The app brings requests, project management, messages and deliverables into one place.",
    ],
    keywords: "creators discovery marketplace app photography video portfolio",
    screenshot: {
      src: "/images/apps/kapture-journey-demo.gif",
      poster: "/images/apps/kapture-journey-demo-poster.png",
      alt: "Kapture demo: discover a creator in Explore, browse their photos, review a project’s status, tasks and uploads, then open your own portfolio.",
      caption: "From discovering a creator to managing a project and your own portfolio.",
      width: 402,
      height: 874,
    },
  },
];
