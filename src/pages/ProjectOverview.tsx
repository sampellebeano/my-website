import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import { DeviceStage } from "@/components/DeviceStage";
import { ErrorPage } from "@/components/ErrorPage";
import { SiteShell } from "@/components/SiteShell";
import { projectOverviewPath, projects } from "@/data/projects";

const ProjectOverview = ({ projectId }: { projectId?: string }) => {
  const { pathname } = useLocation();
  const params = useParams();
  const id = projectId ?? params.projectId ?? pathname.split("/")[2];
  const project = projects.find(item => item.id === id || (item.slug && item.slug === id));
  if (!project) return <ErrorPage eyebrow="Side projects" title="Project not found" description="I couldn’t find that project." to="/projects" linkLabel="All projects" />;

  return (
    <SiteShell>
      <DeviceStage headingId="app-title" className="app-overview" selectedId={project.id} intro={
        <div className="screen-copy">
          <Link className="overview-back quiet-link" to="/projects"><ArrowLeft size={14} aria-hidden="true" /> All projects</Link>
          <p className="screen-kicker">{project.context.replace("Personal project · ", "")} <span className="project-status">{project.status}</span></p>
          <h1 id="app-title">{project.title}</h1>
          <p className="app-summary">{project.summary}</p>
        </div>
      } details={
        <div className="app-detail-copy">
          <div className="app-description">
            {project.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
          </div>
          <div className="app-overview-links">
            {(project.setupHref || project.href) && <a className="quiet-link" href={project.setupHref ?? project.href}>{project.setupHref ? "Setup guide" : "Project page"} <ArrowUpRight size={14} aria-hidden="true" /></a>}
            <nav className="app-switcher" aria-label="Switch project">{projects.map(app => <Link key={app.id} to={projectOverviewPath(app)} aria-current={app.id === project.id ? "page" : undefined}>{app.title}</Link>)}</nav>
          </div>
        </div>
      } />
    </SiteShell>
  );
};

export default ProjectOverview;
