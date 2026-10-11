import { Link, useLocation } from "react-router-dom";
import { CVNavigation } from "@/components/CVNavigation";
import { SiteShell } from "@/components/SiteShell";
import { entries, sections } from "@/data/cv";
import { projects } from "@/data/projects";
import { publicContent } from "@/data/public-content";
import { searchPublicContent } from "@/lib/public-search";

const SearchResults = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = (params.get("query") ?? "").trim();
  const section = params.get("section") ?? "";
  const sectionName = sections.find(item => item.id === section)?.label;
  const results = searchPublicContent(query, section, entries, publicContent, projects);

  return (
    <SiteShell>
        <div className="page-heading"><p className="eyebrow">Search & CV</p><h1>{query ? `Results for “${query}”` : sectionName ?? "Full CV"}</h1></div>
        <div className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <Link className="nav-link" to="/search">All CV</Link><CVNavigation />
        </div>
        <p role="status" className="mt-2 text-sm text-muted-foreground">{results.length} {results.length === 1 ? "result" : "results"}{query && sectionName ? ` in ${sectionName.toLowerCase()}` : ""}</p>
        <div className="article-list mt-6">
          {results.map(entry => (
            <article key={`${entry.source}-${entry.id}`} className="content-article" aria-labelledby={`title-${entry.source}-${entry.id}`}>
              <p className="article-context">{entry.source === "cv" ? sections.find(item => item.id === entries.find(record => record.id === entry.id)?.section)?.label : entry.source === "project" ? "Projects" : entry.source === "activity" ? "Updates" : "Books"} · {entry.context}</p>
              <h2 id={`title-${entry.source}-${entry.id}`}><Link to={entry.href}>{entry.title}</Link></h2>
              {entry.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
              {entry.source === "cv" && entry.id === "contact" && <div className="mt-4 flex flex-wrap gap-5"><a className="nav-link" href="mailto:sam.jgreen@icloud.com">Email Sam</a><a className="nav-link" href="https://www.linkedin.com/in/samjohngreen" target="_blank" rel="noopener noreferrer">Connect on LinkedIn</a></div>}
            </article>
          ))}
          {results.length === 0 && <div className="rounded-xl border border-border p-6"><h2 className="font-medium">No matching entries</h2><p className="mt-2 text-muted-foreground">Try Kapture, bassh, ITOM or AI, or browse the full CV.</p><Link className="mt-4 inline-block font-medium text-google-blue hover:underline" to="/search">Browse the full CV</Link></div>}
        </div>
    </SiteShell>
  );
};

export default SearchResults;
