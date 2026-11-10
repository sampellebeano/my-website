import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { IPhoneShowcase } from "@/components/IPhoneShowcase";
import { SiteShell } from "@/components/SiteShell";
import { projects } from "@/data/projects";

const ProjectOverview = ({ projectId }: { projectId?: string }) => {
  const { pathname, search } = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  const id = projectId ?? params.projectId ?? pathname.split("/")[2];
  const project = projects.find(item => item.id === id);
  if (!project) return <SiteShell><section className="project-missing"><p className="screen-kicker">Personal builds</p><h1>Project not found<span className="accent-dot">.</span></h1><p>That project isn’t in the collection.</p><Link className="primary-link" to="/projects"><ArrowLeft size={16} aria-hidden="true" />All projects</Link></section></SiteShell>;

  const totalPages = Math.max(1, Math.ceil(project.paragraphs.length / 2));
  const requestedPage = Number(new URLSearchParams(search).get("page") ?? 1);
  const page = Number.isFinite(requestedPage) ? Math.min(totalPages, Math.max(1, Math.floor(requestedPage))) : 1;
  const paragraphs = project.paragraphs.slice((page - 1) * 2, page * 2);
  const pageHref = (value: number) => `/projects/${project.id}${value > 1 ? `?page=${value}` : ""}`;

  return (
    <SiteShell>
      <section className="split-screen app-overview" aria-labelledby="app-title">
        <div className="screen-copy app-introduction">
          <Link className="overview-back quiet-link" to="/projects"><ArrowLeft size={14} aria-hidden="true" /> All projects</Link>
          <p className="screen-kicker">{project.context.replace("Personal project · ", "")} <span className="project-status">{project.status}</span></p>
          <h1 id="app-title">{project.title}</h1>
          <p className="app-summary">{project.summary}</p>
        </div>
        <div className="app-detail-copy">
          <div className="app-description" key={`${project.id}-${page}`}>
            {paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
          </div>
          <div className="app-overview-actions">
            {totalPages > 1 && <nav className="description-pages" aria-label={`${project.title} description pages`}>
              {page > 1 ? <Link to={pageHref(page - 1)} className="page-arrow" aria-label="Previous description page"><ArrowLeft size={16} aria-hidden="true" /></Link> : <span className="page-arrow is-disabled" aria-hidden="true"><ArrowLeft size={16} /></span>}
              <span aria-live="polite">{page} / {totalPages}</span>
              {page < totalPages ? <Link to={pageHref(page + 1)} className="page-arrow" aria-label="Next description page"><ArrowRight size={16} aria-hidden="true" /></Link> : <span className="page-arrow is-disabled" aria-hidden="true"><ArrowRight size={16} /></span>}
            </nav>}
            {project.href && <a className="quiet-link" href={project.href}>Setup & project page <ArrowUpRight size={14} aria-hidden="true" /></a>}
          </div>
          <nav className="app-switcher" aria-label="Switch project">{projects.map(app => <Link key={app.id} to={`/projects/${app.id}`} aria-current={app.id === project.id ? "page" : undefined}>{app.title}</Link>)}</nav>
        </div>
        <aside className="screen-phone" aria-label={`${project.title} preview`}>
          <IPhoneShowcase key={project.id} selectedId={project.id} onSelectProject={app => navigate(`/projects/${app.id}`)} onHome={() => navigate("/projects")} />
        </aside>
      </section>
    </SiteShell>
  );
};

export default ProjectOverview;
