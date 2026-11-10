import { useLocation, useNavigate } from "react-router-dom";
import { IPhoneShowcase } from "@/components/IPhoneShowcase";
import { ProjectLinks } from "@/components/ProjectLinks";
import { SiteShell } from "@/components/SiteShell";
import { projects } from "@/data/projects";
import ProjectOverview from "./ProjectOverview";

const Projects = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const entry = new URLSearchParams(search).get("entry");
  if (entry && projects.some(project => project.id === entry)) return <ProjectOverview projectId={entry} />;
  return (
    <SiteShell>
      <section className="split-screen" aria-labelledby="projects-title">
        <div className="screen-copy">
          <p className="screen-kicker">Personal builds</p>
          <h1 id="projects-title">A few ideas,<br />made real<span className="accent-dot">.</span></h1>
          <p className="screen-lede">Apps I’m building outside work. Pick a project to see what it does and take a look inside.</p>
          <ProjectLinks />
        </div>
        <aside className="screen-phone" aria-label="Explore my apps"><IPhoneShowcase onSelectProject={app => navigate(`/projects/${app.id}`)} /></aside>
      </section>
    </SiteShell>
  );
};

export default Projects;
