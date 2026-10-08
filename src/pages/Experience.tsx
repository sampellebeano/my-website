import { Link } from "react-router-dom";
import { SiteShell } from "@/components/SiteShell";
import { entries } from "@/data/cv";

const Experience = () => (
  <SiteShell>
    <div className="page-heading"><p className="eyebrow">The CV</p><h1>Experience</h1><p>Eight years in enterprise software, from solution engineering to enterprise architecture.</p></div>
    <div className="article-list">
      {entries.filter(entry => entry.section === "experience").map(entry => (
        <article key={entry.id} id={entry.id} aria-labelledby={`title-${entry.id}`} className="content-article">
          <p className="article-context">{entry.context}</p>
          <h2 id={`title-${entry.id}`}>{entry.title}</h2>
          {entry.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        </article>
      ))}
    </div>
    <div className="collection-links"><Link className="text-link" to="/search?section=qualifications">Courses & credentials <span aria-hidden="true">↗</span></Link><Link className="text-link" to="/search">View full CV <span aria-hidden="true">↗</span></Link></div>
  </SiteShell>
);

export default Experience;
