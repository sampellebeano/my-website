export interface PersonalProject {
  id: string;
  title: string;
  context: string;
  summary: string;
  paragraphs: string[];
  keywords?: string;
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
    summary: "A native iPhone terminal for connecting to my Mac over SSH.",
    paragraphs: [
      "I’m building a native iPhone terminal for accessing a Mac over SSH.",
      "It keeps terminal sessions and saved connections on the phone, while development tools, scripts and Git run on the Mac.",
    ],
    keywords: "terminal SSH remote access development tools",
  },
];
