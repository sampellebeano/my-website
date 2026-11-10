import { Link, useLocation } from "react-router-dom";
import { SiteShell } from "@/components/SiteShell";
import { PageHeading } from "@/components/PageHeading";
import { cvDownloads, entries } from "@/data/cv";
import "./collection-views.css";

const Experience = () => {
  const { search } = useLocation();
  const selectedId = new URLSearchParams(search).get("entry");
  const roles = entries.filter(entry => entry.section === "experience");
  const highlights = entries.filter(entry => entry.section === "work");
  const selectedHighlight = highlights.find(entry => entry.id === selectedId);
  const selectedRole = roles.find(entry => entry.id === (selectedHighlight?.roleId ?? selectedId)) ?? roles[0];
  const selectedEntry = selectedHighlight?.roleId === selectedRole.id ? selectedHighlight : selectedRole;
  const roleHighlights = highlights.filter(entry => entry.roleId === selectedRole.id);

  return (
    <SiteShell layout="wide-section">
      <section className="collection-view experience-view" aria-labelledby="experience-title">
        <PageHeading className="collection-heading" eyebrow="Work" id="experience-title" title="Experience" description="What I do at ServiceNow, and what I did before that." />
        <div className="collection-layout">
          <nav className="collection-index" aria-label="Roles">
            <ul>
              {roles.map(role => (
                <li key={role.id}>
                  <Link to={`/experience?entry=${role.id}`} aria-current={role.id === selectedRole.id ? "true" : undefined}>
                    <span className="collection-index-label">{role.title.split(" | ")[0]}</span>
                    <span className="collection-index-description">{role.title.split(" | ").slice(1).join(" | ")}</span>
                    <span className="collection-index-meta">{role.context}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="collection-detail">
            {roleHighlights.length > 0 && (
              <nav className="collection-subnav" aria-label="Role overview and highlights">
                <Link to={`/experience?entry=${selectedRole.id}`} aria-current={selectedEntry.id === selectedRole.id ? "page" : undefined}>Role overview</Link>
                {roleHighlights.map(highlight => <Link key={highlight.id} to={`/experience?entry=${highlight.id}`} aria-current={selectedEntry.id === highlight.id ? "page" : undefined}>{highlight.title}</Link>)}
              </nav>
            )}
            <article id={selectedEntry.id} className="collection-article" aria-labelledby={`title-${selectedEntry.id}`}>
              <p className="article-context">{selectedEntry.context}</p>
              <h2 id={`title-${selectedEntry.id}`}>{selectedEntry.title}</h2>
              {selectedEntry.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            </article>
          </div>
        </div>
        <div className="collection-footer collection-links">
          <a className="text-link" href={cvDownloads.pdf} download>CV (PDF) <span aria-hidden="true">↓</span></a>
          <Link className="text-link" to="/cv?section=qualifications">Courses & credentials <span aria-hidden="true">↗</span></Link>
          <Link className="text-link" to="/cv">View full CV <span aria-hidden="true">↗</span></Link>
        </div>
      </section>
    </SiteShell>
  );
};

export default Experience;
