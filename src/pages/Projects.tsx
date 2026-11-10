import { useLocation } from "react-router-dom";
import { DeviceStage } from "@/components/DeviceStage";
import { ProjectLinks } from "@/components/ProjectLinks";
import { SiteShell } from "@/components/SiteShell";
import { projects } from "@/data/projects";
import ProjectOverview from "./ProjectOverview";

const Projects = () => {
  const { search } = useLocation();
  const entry = new URLSearchParams(search).get("entry");
  if (entry && projects.some(project => project.id === entry)) return <ProjectOverview projectId={entry} />;
  return (
    <SiteShell>
      <DeviceStage headingId="projects-title" intro={
        <div className="screen-copy">
          <p className="screen-kicker">Side projects</p>
          <h1 id="projects-title">What I’m<br />building<span className="accent-dot">.</span></h1>
          <p className="screen-lede">A few apps I’m working on in my own time. Open one to read about it, or try the recordings on the phone.</p>
        </div>
      } details={<ProjectLinks />} />
    </SiteShell>
  );
};

export default Projects;
