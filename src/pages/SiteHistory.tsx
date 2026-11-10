import { Link, useLocation } from "react-router-dom";
import { SiteShell } from "@/components/SiteShell";
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
        <header className="collection-heading">
          <p className="eyebrow">The site, over time</p>
          <h1 id="history-title">Site history</h1>
          <p>Saved editions, with a few notes on what changed.</p>
        </header>
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
              {selectedVersion.notes?.length > 0 && <div className="collection-notes"><h3>Making notes</h3><ul>{selectedVersion.notes.map((note, index) => <li key={index}>{note}</li>)}</ul></div>}
              <a className="text-link collection-snapshot-link" href={`${import.meta.env.BASE_URL}${selectedVersion.path}`}>Open saved site <span aria-hidden="true">↗</span></a>
            </article>
          </div>
        ) : (
          <div className="empty-state"><h2>No saved editions yet.</h2><p>Preserved versions will appear here when they’re ready.</p></div>
        )}
        <div className="collection-footer collection-current">
          <p><span>Current edition</span> Warm off-white, one screen at a time, with the apps in the right-hand phone.</p>
          <Link className="text-link" to="/">Visit the current homepage <span aria-hidden="true">↗</span></Link>
        </div>
      </section>
    </SiteShell>
  );
};

export default SiteHistory;
