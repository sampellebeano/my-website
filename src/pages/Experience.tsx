import { Link, useSearchParams } from "react-router-dom";
import { SiteShell } from "@/components/SiteShell";
import { entries } from "@/data/cv";

const Experience = () => {
  const [params] = useSearchParams();
  const requested = params.get("entry");
  const roles = entries.filter(entry => entry.section === "experience");
  const highlights = entries.filter(entry => entry.section === "work");
  const selected = [...roles, ...highlights].find(entry => entry.id === requested);
  const employerRole = selected?.roleId ? roles.find(role => role.id === selected.roleId) : null;
  return (
  <SiteShell>
    <div className="page-heading"><p className="eyebrow">The CV</p><h1>Experience</h1><p>My career in enterprise software, including the initiatives and programmes that are part of those roles.</p></div>
    {requested && !selected && <p role="status" className="entry-notice">That career entry is unavailable. Browse my experience below.</p>}
    {selected && <Link className="text-link back-link" to="/experience">← All experience</Link>}
    {employerRole && <p className="career-owner">Part of <Link className="text-link" to={`/experience?entry=${employerRole.id}`}>{employerRole.title}</Link></p>}
    <div className="article-list">
      {(selected ? [selected] : roles).map(entry => (
        <article key={entry.id} id={entry.id} aria-labelledby={`title-${entry.id}`} className="content-article">
          <p className="article-context">{entry.context}</p>
          <h2 id={`title-${entry.id}`}>{entry.title}</h2>
          {entry.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
          {highlights.some(highlight => highlight.roleId === entry.id) && <div className="career-highlights"><p>Highlights from this role</p><ul>{highlights.filter(highlight => highlight.roleId === entry.id).map(highlight => <li key={highlight.id}><Link className="text-link" to={`/experience?entry=${highlight.id}`}>{highlight.title} <span aria-hidden="true">↗</span></Link><span>{highlight.context}</span></li>)}</ul></div>}
        </article>
      ))}
    </div>
    <div className="collection-links"><Link className="text-link" to="/search?section=qualifications">Courses & credentials <span aria-hidden="true">↗</span></Link><Link className="text-link" to="/search">View full CV <span aria-hidden="true">↗</span></Link></div>
  </SiteShell>
  );
};

export default Experience;
