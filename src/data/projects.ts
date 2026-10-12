export interface PersonalProject {
  id: string;
  title: string;
  context: string;
  summary: string;
  paragraphs: string[];
  keywords?: string;
  download?: { href: string; label: string; availability: string };
}

// Personal builds live here. Employer initiatives belong to the career records.
export const projects: PersonalProject[] = [
  {
    id: "kapture",
    title: "Kapture",
    context: "Personal project · iOS & web",
    summary: "A creator marketplace, with an iOS app and a companion website.",
    paragraphs: [
      "I’m building a marketplace that connects clients with creators, with an iOS app and a companion website for creator discovery.",
      "The app brings requests, project management, messaging and deliverables into one place.",
    ],
    keywords: "creators discovery marketplace app photography video portfolio",
  },
  {
    id: "bassh",
    title: "bassh",
    context: "Personal project · iPhone & Mac",
    summary: "A native iPhone terminal for your Mac over SSH. Keep your tools, scripts and Git on the Mac, with saved connections and terminal sessions on your phone.",
    paragraphs: [
      "I’m building bassh to put my Mac’s shell in my hand. The native iPhone app connects over SSH, so development tools, scripts and Git run on the Mac while I work from my phone.",
      "Saved connections and multiple terminal sessions make it easy to return to work. Terminal controls keep keys such as Escape, Tab, Control and the arrows within reach alongside the iPhone keyboard.",
      "The Mac companion guides you through connecting your own devices with Tailscale and macOS Remote Login, authorizing your iPhone’s SSH public key and checking the Mac’s host fingerprint.",
      "The Mac companion is available as an early preview for macOS 15 or later on Apple Silicon and Intel. It is not yet notarized by Apple, and the iPhone app is in private testing ahead of its App Store release. The download page includes installation notes, a setup guide and an email link to express interest in the release.",
    ],
    keywords: "terminal SSH remote access development tools Tailscale TestFlight Mac companion download preview",
    download: {
      href: "/bassh",
      label: "Download Mac preview",
      availability: "Mac companion preview · macOS 15+. iPhone app in private testing.",
    },
  },
];
