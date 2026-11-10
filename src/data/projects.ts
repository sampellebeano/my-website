export interface PersonalProject {
  id: string;
  title: string;
  href?: string;
  setupHref?: string;
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
    setupHref: "/bassh#setup",
    icon: "/bassh/icon.png",
    context: "Personal project · iPhone & Mac",
    status: "Private testing",
    summary: "My Mac’s terminal, on my iPhone.",
    paragraphs: [
      "I’m building bassh so I can use my Mac’s terminal from my phone. Everything runs on the Mac. The phone connects over SSH.",
      "It saves my connections and lets me keep a few sessions open. There’s an extra row of keys for Escape, Tab, Control and arrows, so I don’t have to fight the iPhone keyboard.",
      "There’s a Mac app to help set up Tailscale and Remote Login, authorise the phone’s SSH key and check the Mac’s host fingerprint.",
      "The Mac app needs macOS 15 or later and works on Apple Silicon and Intel. The iPhone app is in private testing. Downloads aren’t available here yet, but there’s a setup guide for existing testers. You can email me for release updates.",
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
    title: "highlighter",
    context: "Personal project · iPhone",
    status: "In development",
    summary: "A map of the places I’ve run.",
    paragraphs: [
      "highlighter puts my runs on a map so I can see where I’ve been.",
      "I’m starting with runs from Apple Health. I can look through recent runs, open the details and see the recorded routes. The running history stays on the phone.",
      "I’m still building it. For now, it shows the original GPS routes. Matching those to roads and paths, tracking street coverage and colouring repeat visits are still work in progress.",
    ],
    keywords: "highlighter running map fitness workouts GPS routes Apple Health HealthKit Run the World Run Your World RTW RYW",
  },
  {
    id: "kapture",
    title: "Kapture",
    icon: "/images/apps/kapture-icon.png",
    context: "Personal project · iOS & web",
    status: "In development",
    summary: "Find a creator, plan a project and keep the work in one place.",
    paragraphs: [
      "I’m building Kapture to help people find photographers, videographers and other creators to work with. There’s an iPhone app and a website where you can browse creators.",
      "The app keeps project requests, messages, tasks and files together, from the first conversation through to handing over the work. It’s still in development.",
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
