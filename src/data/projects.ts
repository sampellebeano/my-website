export interface PersonalProject {
  id: string;
  slug?: string;
  title: string;
  href?: string;
  setupHref?: string;
  icon?: string;
  context: string;
  status?: string;
  summary: string;
  paragraphs: string[];
  screenshot?: {
    src: string;
    poster: string;
    alt: string;
    caption: string;
    width: number;
    height: number;
  };
}

export function projectOverviewPath(project: PersonalProject): string {
  return `/projects/${project.slug ?? project.id}`;
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
    summary: "My Mac’s terminal on my iPhone, for when I’m away from my desk.",
    paragraphs: [
      "Sometimes I just want to run one command from my phone and get on with my day. That’s what got me building bassh. The phone connects over SSH. My tools and scripts still run on the Mac.",
      "It saves my connections and lets me keep a few sessions open. There’s an extra row of keys for Escape, Tab, Control and arrows, so I don’t have to fight the iPhone keyboard.",
      "There’s a Mac app to help set up Tailscale and Remote Login, authorise the phone’s SSH key and check the Mac’s host fingerprint.",
      "The Mac app needs macOS 15 or later and works on Apple Silicon and Intel. The iPhone app is in private testing. Downloads aren’t available here yet, but there’s a setup guide for existing testers. You can email me for release updates.",
    ],
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
    slug: "highlighter",
    title: "highlighter",
    context: "Personal project · iPhone",
    status: "In development",
    summary: "A map of my runs and the places they’ve taken me.",
    paragraphs: [
      "I wanted a map I could look at and think, ‘Oh, I remember that run.’ Sometimes seeing a little turn in the route is enough to bring the whole thing back. I’m making highlighter so I can find those runs again.",
      "I’m starting with runs from Apple Health. I can look through recent runs, open the details and see the recorded routes. The running history stays on the phone.",
      "I’m still building it. For now, it shows the original GPS routes. Matching those to roads and paths, tracking street coverage and colouring repeat visits are still work in progress.",
    ],
  },
  {
    id: "kapture",
    title: "Kapture",
    icon: "/images/apps/kapture-icon.png",
    context: "Personal project · iOS & web",
    status: "In development",
    summary: "Find a creator whose work you love and make something together.",
    paragraphs: [
      "I love the moment when you see someone’s work and think, ‘That’s the person I want to make this with.’ I’m building Kapture’s iPhone app and website to help people find photographers, videographers and other creators and start that first conversation.",
      "The app keeps project requests, messages, tasks and files together, from the first conversation through to handing over the work. It’s still in development.",
    ],
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
