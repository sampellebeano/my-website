import { ArrowLeft, ArrowUpRight, MapPin } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import { DeviceStage } from "@/components/DeviceStage";
import { ErrorPage } from "@/components/ErrorPage";
import { ProjectLinks } from "@/components/ProjectLinks";
import { SiteShell } from "@/components/SiteShell";
import { projectOverviewPath, projects, type PersonalProject } from "@/data/projects";

const HomeIntro = () => (
  <div className="home-copy">
    <p className="screen-kicker">Sam Green</p>
    <h1 id="home-title">Solution consulting at ServiceNow.<br />Developing applications in my spare time<span className="accent-dot">.</span></h1>
    <p className="screen-lede">I’m a Solution Consultant at ServiceNow. Outside work, I’m building bassh, highlighter and Kapture. This is where I share what I’m up to.</p>
    <p className="location-line"><MapPin size={14} aria-hidden="true" /> Based in the UAE</p>
    <div className="screen-actions">
      <Link className="primary-link" to="/projects">What I’m building <ArrowUpRight size={16} aria-hidden="true" /></Link>
      <Link className="quiet-link" to="/experience">About my work</Link>
    </div>
  </div>
);

const ProjectsIntro = () => (
  <div className="screen-copy">
    <p className="screen-kicker">Side projects</p>
    <h1 id="projects-title">What I’m<br />building<span className="accent-dot">.</span></h1>
    <p className="screen-lede">A few apps I’m working on in my own time. Open one to read about it, or try the recordings on the phone.</p>
  </div>
);

const ProjectIntro = ({ project }: { project: PersonalProject }) => (
  <div className="screen-copy">
    <Link className="overview-back quiet-link" to="/projects"><ArrowLeft size={14} aria-hidden="true" /> All projects</Link>
    <p className="screen-kicker">{project.context.replace("Personal project · ", "")} <span className="project-status">{project.status}</span></p>
    <h1 id="app-title">{project.title}</h1>
    <p className="app-summary">{project.summary}</p>
  </div>
);

const ProjectDetails = ({ project }: { project: PersonalProject }) => (
  <div className="app-detail-copy">
    <div className="app-description">
      {project.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
    </div>
    <div className="app-overview-links">
      {(project.setupHref || project.href) && <a className="quiet-link" href={project.setupHref ?? project.href}>{project.setupHref ? "Setup guide" : "Project page"} <ArrowUpRight size={14} aria-hidden="true" /></a>}
      <nav className="app-switcher" aria-label="Switch project">{projects.map(app => <Link key={app.id} to={projectOverviewPath(app)} aria-current={app.id === project.id ? "page" : undefined}>{app.title}</Link>)}</nav>
    </div>
  </div>
);

const Showcase = () => {
  const { pathname, search } = useLocation();
  const { projectId } = useParams();
  const home = pathname === "/";
  const entry = new URLSearchParams(search).get("entry");
  const project = projectId
    ? projects.find(item => item.id === projectId || item.slug === projectId)
    : projects.find(item => !home && item.id === entry);
  if (projectId && !project) return <ErrorPage eyebrow="Side projects" title="Project not found" description="I couldn’t find that project." to="/projects" linkLabel="All projects" />;

  return (
    <SiteShell>
      <DeviceStage
        headingId={project ? "app-title" : home ? "home-title" : "projects-title"}
        className={project ? "app-overview" : home ? "home-screen" : undefined}
        selectedId={project?.id}
        intro={project ? <ProjectIntro project={project} /> : home ? <HomeIntro /> : <ProjectsIntro />}
        details={project ? <ProjectDetails project={project} /> : home ? (
          <section id="projects" className="home-projects" aria-labelledby="selected-work-title">
            <p id="selected-work-title" className="screen-kicker">Personal projects</p>
            <ProjectLinks compact />
          </section>
        ) : <ProjectLinks />}
      />
    </SiteShell>
  );
};

export default Showcase;
