import { Link, Navigate, useSearchParams } from "react-router-dom";
import { SiteShell } from "@/components/SiteShell";
import { entries } from "@/data/cv";
import { projects } from "@/data/projects";

const Projects = () => {
  const [params] = useSearchParams();
  const requested = params.get("entry");
  const careerId = requested === "presight" ? "enterprise-front-door" : requested;
  if (entries.some(entry => entry.section === "work" && entry.id === careerId)) {
    return <Navigate replace to={`/experience?entry=${encodeURIComponent(careerId!)}`} />;
  }
  const selected = projects.find(entry => entry.id === requested);
  return (
    <SiteShell>
      <div className="page-heading"><p className="eyebrow">Personal builds</p><h1>Projects</h1><p>Apps and tools I’m building outside my day job.</p></div>
      {requested && !selected && <p role="status" className="entry-notice">That project is unavailable. Browse the projects below.</p>}
      {selected && <Link className="text-link back-link" to="/projects">← All projects</Link>}
      <div className="article-list">
        {(selected ? [selected] : projects).map(entry => (
          <article key={entry.id} id={entry.id} aria-labelledby={`title-${entry.id}`} className="content-article">
            <p className="article-context">{entry.context}</p>
            <h2 id={`title-${entry.id}`}><Link to={`/projects?entry=${encodeURIComponent(entry.id)}`}>{entry.title}</Link></h2>
            {entry.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
          </article>
        ))}
      </div>
    </SiteShell>
  );
};

export default Projects;
