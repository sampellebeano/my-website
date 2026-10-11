import type { CVEntry } from "../data/cv.ts";
import type { PersonalProject } from "../data/projects.ts";
import type { PublicContent } from "./public-content.ts";
import { formatPublicDate, sortActivity } from "./public-content.ts";
import { matchesQuery } from "./text-search.ts";

export interface PublicSearchResult {
  id: string;
  source: "cv" | "project" | "activity" | "book";
  title: string;
  context: string;
  paragraphs: string[];
  href: string;
}

export function searchPublicContent(query: string, section: string, cv: readonly CVEntry[], content: PublicContent, projects: readonly PersonalProject[] = []): PublicSearchResult[] {
  const results: PublicSearchResult[] = cv.filter(entry => (!section || entry.section === section)
    && matchesQuery([entry.title, entry.context, ...entry.paragraphs, entry.keywords ?? ""].join(" "), query))
    .map(entry => ({
      id: entry.id, source: "cv", title: entry.title, context: entry.context, paragraphs: entry.paragraphs,
      href: entry.section === "work" || entry.section === "experience" ? `/experience?entry=${encodeURIComponent(entry.id)}`
        : `/search?section=${encodeURIComponent(entry.section)}&query=${encodeURIComponent(query.trim())}`,
    }));
  if (section || !query.trim()) return results;
  for (const project of projects) {
    if (!matchesQuery([project.title, project.context, project.summary, ...project.paragraphs, project.keywords ?? ""].join(" "), query)) continue;
    results.push({ id: project.id, source: "project", title: project.title, context: project.context,
      paragraphs: project.paragraphs, href: `/projects?entry=${encodeURIComponent(project.id)}` });
  }
  for (const entry of sortActivity(content.activity)) {
    if (!matchesQuery([entry.title, ...entry.body].join(" "), query)) continue;
    results.push({ id: entry.id, source: "activity", title: entry.title,
      context: `${entry.kind === "daily" ? "Daily note" : "Weekly recap"} · ${formatPublicDate(entry.publishedAt)}`,
      paragraphs: entry.body, href: `/updates?entry=${encodeURIComponent(entry.id)}` });
  }
  const statuses = { reading: "Reading", read: "Read", "want-to-read": "Want to read" };
  for (const entry of content.books) {
    if (!matchesQuery([entry.title, entry.author, entry.note ?? ""].join(" "), query)) continue;
    results.push({ id: entry.id, source: "book", title: entry.title, context: `${entry.author} · ${statuses[entry.status]}`,
      paragraphs: entry.note ? [entry.note] : [], href: `/books?entry=${encodeURIComponent(entry.id)}` });
  }
  return results;
}
