import { Link, useLocation } from "react-router-dom";
import { CVNavigation } from "@/components/CVNavigation";
import { CVDownloads } from "@/components/CVDownloads";
import { CVFooter } from "@/components/CVFooter";
import { SearchBox } from "@/components/SearchBox";
import { searchEntries, sections } from "@/data/cv";
import { SkipLink } from "@/components/SkipLink";

const SearchResults = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = params.get("query") ?? "";
  const section = params.get("section") ?? "";
  const sectionName = sections.find((item) => item.id === section)?.label;
  const results = searchEntries(query, section);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SkipLink />
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-6 py-6">
          <Link to="/" className="text-2xl font-medium tracking-tight text-google-blue" aria-label="Sam Green home">Sam Green</Link>
          <CVDownloads />
        </div>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-5 px-6 pb-5">
          <Link className="nav-link text-sm" to="/search">All</Link>
          <CVNavigation />
        </div>
      </header>
      <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-4xl flex-1 px-6 py-9">
        <SearchBox key={location.search} initialQuery={query} />
        <h1 className="mt-10 text-2xl font-medium">{query ? `Results for “${query}”` : sectionName ?? "Experience, work and qualifications"}</h1>
        <p role="status" className="mt-2 text-sm text-muted-foreground">{results.length} {results.length === 1 ? "result" : "results"}{query && sectionName ? ` in ${sectionName.toLowerCase()}` : ""}</p>
        <div className="mt-8 space-y-9">
          {results.map((entry) => (
            <article key={entry.id} aria-labelledby={`title-${entry.id}`}>
              <p className="text-sm text-muted-foreground">{sections.find((item) => item.id === entry.section)?.label} · {entry.context}</p>
              <h2 id={`title-${entry.id}`} className="mt-1 text-xl font-medium text-google-blue">{entry.title}</h2>
              {entry.paragraphs.map((paragraph) => <p key={paragraph} className="mt-3 leading-relaxed">{paragraph}</p>)}
              {entry.section === "contact" && <div className="mt-4 flex flex-wrap gap-5"><a className="nav-link" href="mailto:sam.jgreen@icloud.com">Email Sam</a><a className="nav-link" href="https://www.linkedin.com/in/samjohngreen" target="_blank" rel="noopener noreferrer">Connect on LinkedIn</a></div>}
            </article>
          ))}
          {results.length === 0 && <div className="rounded-xl border border-border p-6"><h2 className="font-medium">No matching entries</h2><p className="mt-2 text-muted-foreground">Try ServiceNow, Presight, ITOM, AI or Salesforce, or browse the full CV.</p><Link className="mt-4 inline-block font-medium text-google-blue hover:underline" to="/search">Browse the full CV</Link></div>}
        </div>
      </main>
      <CVFooter />
    </div>
  );
};

export default SearchResults;
