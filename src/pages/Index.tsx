import { Link } from "react-router-dom";
import { SiteShell } from "@/components/SiteShell";
import { entries } from "@/data/cv";
import { publicContent } from "@/data/public-content";
import { formatPublicDate, sortActivity } from "@/lib/public-content";

const Index = () => {
  const projects = ["presight", "aviation"].map(id => entries.find(entry => entry.id === id)!);
  const career = entries.filter(entry => entry.section === "experience");
  const latest = sortActivity(publicContent.activity)[0];
  const reading = publicContent.books.find(book => book.status === "reading");
  return (
    <SiteShell>
      <div className="page-heading overview-heading"><p className="eyebrow">Solution engineering · Architecture · AI</p><h1>Overview</h1></div>
      <section aria-labelledby="work-title" className="overview-section">
        <div className="section-heading"><h2 id="work-title">Selected work</h2><Link className="text-link" to="/projects">All projects <span aria-hidden="true">↗</span></Link></div>
        <div className="featured-projects">
          {projects.map(project => (
            <article key={project.id} className="featured-project">
              <p className="article-context">{project.context}</p>
              <h3><Link to={`/projects?entry=${project.id}`}>{project.title} <span aria-hidden="true">↗</span></Link></h3>
              <p>{project.id === "presight" ? "A proposed single front door across IT, HR, Customer Experience, App Development and Asset Management." : "Connecting enterprise needs with ServiceNow use cases and demonstrations for an airport and an international airline."}</p>
            </article>
          ))}
        </div>
      </section>
      <section aria-labelledby="career-title" className="overview-section">
        <div className="section-heading"><h2 id="career-title">Career</h2><Link className="text-link" to="/experience">Experience <span aria-hidden="true">↗</span></Link></div>
        <div className="career-list">
          {career.map(entry => {
            const [company, role] = entry.title.split(" | ");
            return <article key={entry.id} className="career-row"><div><h3>{company}</h3><p>{role}</p></div><p className="career-date">{entry.context}</p></article>;
          })}
        </div>
      </section>
      <section aria-labelledby="recent-title" className="overview-section">
        <div className="section-heading"><h2 id="recent-title">Lately</h2><Link className="text-link" to="/updates">All updates <span aria-hidden="true">↗</span></Link></div>
        {latest ? <article className="latest-update"><p className="article-context">{latest.kind === "weekly" ? "Weekly recap" : "Daily note"} · <time dateTime={latest.publishedAt}>{formatPublicDate(latest.publishedAt)}</time></p><h3><Link to={`/updates?entry=${latest.id}`}>{latest.title} <span aria-hidden="true">↗</span></Link></h3></article>
          : <p className="quiet-empty">No updates published yet.</p>}
      </section>
      {reading && <section aria-labelledby="reading-title" className="overview-reading"><h2 id="reading-title">Currently reading</h2><p><Link className="text-link" to={`/books?entry=${reading.id}`}>{reading.title} <span aria-hidden="true">↗</span></Link><span className="reading-author"> · {reading.author}</span></p></section>}
    </SiteShell>
  );
};

export default Index;
