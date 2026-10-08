import activity from "../../content/activity.json";
import books from "../../content/books.json";
import versions from "../../content/site-versions.json";
import { entries } from "./cv";
import { parsePublicContent } from "../lib/public-content";

export const publicContent = parsePublicContent({ activity, books, versions }, entries.filter(entry => entry.section === "work").map(entry => entry.id));
