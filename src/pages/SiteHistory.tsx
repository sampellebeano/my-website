import { Link, useLocation } from "react-router-dom";
import { SiteShell } from "@/components/SiteShell";
import { PageHeading } from "@/components/PageHeading";
import { publicContent } from "@/data/public-content";
import { formatPublicDate, sortSiteVersions } from "@/lib/public-content";
import "./collection-views.css";

const SiteHistory = () => {
  const { search } = useLocation();
  const selectedId = new URLSearchParams(search).get("entry");
  const versions = sortSiteVersions(publicContent.versions);
  const selectedVersion = versions.find(version => version.id === selectedId) ?? versions[0];

  return (
    <SiteShell>
      <section className="collection-view history-view" aria-labelledby="history-title">
        <PageHeading className="collection-heading" eyebrow="Older versions" id="history-title" title="Site history" description="I’ve kept the old versions here, with a few notes on what I changed." />
        {selectedVersion ? (
          <div className="collection-layout">
            <nav className="collection-index" aria-label="Saved editions">
              <ul>
                {versions.map(version => (
                  <li key={version.id}>
                    <Link to={`/history?entry=${version.id}`} aria-current={version.id === selectedVersion.id ? "page" : undefined}>
                      <span className="collection-index-label">{version.label}</span>
                      <span className="collection-index-meta">Captured <time dateTime={version.capturedOn}>{formatPublicDate(version.capturedOn)}</time></span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <article id={selectedVersion.id} className="collection-article" aria-labelledby={`history-title-${selectedVersion.id}`}>
              <p className="article-context">Captured <time dateTime={selectedVersion.capturedOn}>{formatPublicDate(selectedVersion.capturedOn)}</time></p>
              <h2 id={`history-title-${selectedVersion.id}`}>{selectedVersion.label}</h2>
              {selectedVersion.summary && <p>{selectedVersion.summary}</p>}
              {selectedVersion.notes?.length > 0 && <div className="collection-notes"><h3>What changed</h3><ul>{selectedVersion.notes.map((note, index) => <li key={index}>{note}</li>)}</ul></div>}
              <a className="text-link collection-snapshot-link" href={`${import.meta.env.BASE_URL}${selectedVersion.path}`}>Open saved site <span aria-hidden="true">↗</span></a>
            </article>
          </div>
        ) : (
          <div className="empty-state"><h2>No old versions saved yet.</h2><p>I’ll keep them here when I change the site.</p></div>
        )}
        <div className="collection-footer collection-current">
          <p><span>Current site</span> A lighter background, shorter pages and a phone showing app recordings.</p>
          <Link className="text-link" to="/">Back to the homepage <span aria-hidden="true">↗</span></Link>
        </div>
      </section>
    </SiteShell>
  );
};

export default SiteHistory;
