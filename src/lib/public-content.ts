import { z } from "zod";

const DAY = 86_400_000;
const TIMEZONE = "Asia/Dubai";
const nonblank = z.string().trim().min(1);
const identifier = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

function isCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

const calendarDate = z.string().refine(isCalendarDate);
const timestamp = z.string().datetime({ offset: true }).refine(value =>
  isCalendarDate(value.slice(0, 10)) && Number.isFinite(Date.parse(value)),
);
const linkSchema = z.object({ label: nonblank, href: nonblank }).strict();
const activityFields = {
  id: identifier,
  title: nonblank,
  body: z.array(nonblank).min(1).max(4),
  publishedAt: timestamp,
  links: z.array(linkSchema).optional(),
};
const dailySchema = z.object({ ...activityFields, kind: z.literal("daily"), activityDate: calendarDate }).strict();
const weeklySchema = z.object({
  ...activityFields,
  kind: z.literal("weekly"),
  startDate: calendarDate,
  endDate: calendarDate,
  dailyEntryIds: z.array(identifier).min(1),
}).strict();
const bookSchema = z.object({
  id: identifier,
  title: nonblank,
  author: nonblank,
  status: z.enum(["reading", "read", "want-to-read"]),
  completedOn: calendarDate.optional(),
  url: nonblank.optional(),
  note: nonblank.optional(),
}).strict();
const versionSchema = z.object({
  id: identifier,
  label: nonblank,
  capturedOn: calendarDate,
  sourceRevision: z.string().regex(/^[a-f0-9]{7,40}$/),
  path: z.string().regex(/^history\/\d{4}-\d{2}-\d{2}\/index\.html$/),
}).strict();
const contentSchema = z.object({
  activity: z.array(z.discriminatedUnion("kind", [dailySchema, weeklySchema])),
  books: z.array(bookSchema),
  versions: z.array(versionSchema),
}).strict();

export type PublicLink = z.infer<typeof linkSchema>;
export type DailyActivity = z.infer<typeof dailySchema>;
export type WeeklyActivity = z.infer<typeof weeklySchema>;
export type ActivityEntry = DailyActivity | WeeklyActivity;
export type BookEntry = z.infer<typeof bookSchema>;
export type SiteVersion = z.infer<typeof versionSchema>;
export type PublicContent = z.infer<typeof contentSchema>;
export interface ActivityWeek {
  startDate: string;
  endDate: string;
  daily: DailyActivity[];
  recap: WeeklyActivity | null;
}

function invalid(path: string, reason: string): never {
  throw new Error(`Public content: ${path}: ${reason}.`);
}

function validateLink(href: string, path: string, content: PublicContent, cvIds: readonly string[]): void {
  if (href.startsWith("https://")) {
    try {
      const url = new URL(href);
      if (url.protocol === "https:" && url.hostname && !url.username && !url.password) return;
    } catch { /* Report a redacted validation error below. */ }
    invalid(path, "use an HTTPS URL without credentials");
  }
  if (!href.startsWith("#/")) invalid(path, "use HTTPS or a recognised #/ route");
  const route = new URL(href.slice(1), "https://public-content.invalid");
  const allowed = ["/", "/experience", "/projects", "/updates", "/books", "/search"];
  if (route.origin !== "https://public-content.invalid" || !allowed.includes(route.pathname) || route.hash) {
    invalid(path, "unknown website route");
  }
  const selected = route.searchParams.getAll("entry");
  if (selected.length) {
    const ids = route.pathname === "/updates" ? content.activity.map(entry => entry.id)
      : route.pathname === "/books" ? content.books.map(entry => entry.id)
      : route.pathname === "/projects" ? cvIds : [];
    if (selected.length !== 1 || !ids.includes(selected[0])) invalid(path, "entry must reference a published record in this view");
  }
}

export function parsePublicContent(input: unknown, cvIds: readonly string[]): PublicContent {
  const result = contentSchema.safeParse(input);
  if (!result.success) {
    // Zod's default messages can contain input values. Keep errors useful without exposing them.
    const issue = result.error.issues[0];
    invalid(issue.path.join(".") || "root", issue.code === "unrecognized_keys"
      ? "contains unrecognised fields; remove them from the public record"
      : "invalid or missing field; check the public content schema");
  }
  const content = result.data;
  const seen = new Set<string>();
  for (const name of ["activity", "books", "versions"] as const) {
    content[name].forEach((record, index) => {
      if (seen.has(record.id)) invalid(`${name}.${index}.id`, "IDs must be unique across public records");
      seen.add(record.id);
    });
  }
  content.activity.forEach((entry, index) => {
    if (entry.kind === "weekly") {
      const start = new Date(`${entry.startDate}T00:00:00Z`);
      const end = new Date(`${entry.endDate}T00:00:00Z`);
      if (start.getUTCDay() !== 1 || end.getUTCDay() !== 0 || end.getTime() - start.getTime() !== 6 * DAY) {
        invalid(`activity.${index}`, "a week must run from Monday through Sunday");
      }
      if (new Set(entry.dailyEntryIds).size !== entry.dailyEntryIds.length) invalid(`activity.${index}.dailyEntryIds`, "daily references must be unique");
      entry.dailyEntryIds.forEach(id => {
        const daily = content.activity.find(record => record.id === id);
        if (!daily || daily.kind !== "daily" || daily.activityDate < entry.startDate || daily.activityDate > entry.endDate) {
          invalid(`activity.${index}.dailyEntryIds`, "reference published daily notes within this week");
        }
      });
    }
    entry.links?.forEach((link, linkIndex) => validateLink(link.href, `activity.${index}.links.${linkIndex}.href`, content, cvIds));
  });
  content.books.forEach((entry, index) => {
    if (entry.url) validateLink(entry.url, `books.${index}.url`, content, cvIds);
  });
  content.versions.forEach((version, index) => {
    if (version.path !== `history/${version.capturedOn}/index.html`) invalid(`versions.${index}.path`, "path must match the snapshot capture date");
  });
  return content;
}

export function sortActivity(entries: readonly ActivityEntry[]): ActivityEntry[] {
  return [...entries].sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt) || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}

function dubaiCalendarDate(value: string): string {
  if (isCalendarDate(value)) return value;
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: TIMEZONE, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date(value));
  const part = (name: string) => parts.find(item => item.type === name)?.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}

export function formatPublicDate(value: string): string {
  const date = isCalendarDate(value) ? new Date(`${value}T00:00:00Z`) : new Date(value);
  return new Intl.DateTimeFormat("en-GB", { timeZone: TIMEZONE, day: "numeric", month: "short", year: "numeric" }).format(date);
}

export function activityWeek(value: string): { startDate: string; endDate: string } {
  const date = new Date(`${dubaiCalendarDate(value)}T00:00:00Z`);
  const monday = date.getTime() - ((date.getUTCDay() + 6) % 7) * DAY;
  return { startDate: new Date(monday).toISOString().slice(0, 10), endDate: new Date(monday + 6 * DAY).toISOString().slice(0, 10) };
}

export function groupActivity(entries: readonly ActivityEntry[]): ActivityWeek[] {
  const groups = new Map<string, ActivityWeek>();
  for (const entry of sortActivity(entries)) {
    const interval = entry.kind === "daily" ? activityWeek(entry.activityDate) : { startDate: entry.startDate, endDate: entry.endDate };
    const group = groups.get(interval.startDate) ?? { ...interval, daily: [], recap: null };
    if (entry.kind === "daily") group.daily.push(entry);
    else if (!group.recap) group.recap = entry;
    groups.set(interval.startDate, group);
  }
  return [...groups.values()].sort((a, b) => b.startDate.localeCompare(a.startDate));
}
