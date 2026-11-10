import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { projects } from "@/data/projects";

export const ProjectLinks = ({ compact = false, selectedId }: { compact?: boolean; selectedId?: string }) => (
  <nav className={`project-links${compact ? " project-links--compact" : ""}`} aria-label="Personal projects">
    {projects.map(project => (
      <Link key={project.id} id={project.id} to={`/projects/${project.id}`} className={`project-link${selectedId === project.id ? " is-selected" : ""}`} aria-current={selectedId === project.id ? "page" : undefined}>
        {project.icon ? <img className="project-link-icon" src={project.icon} alt="" width="34" height="34" /> : <span className="project-link-monogram" aria-hidden="true">{project.title.slice(0, 2)}</span>}
        <span className="project-link-copy"><span className="project-link-title">{project.title}</span><span className="project-link-summary">{compact ? project.context.replace("Personal project · ", "") : project.summary}</span></span>
        <ArrowUpRight className="project-link-arrow" size={17} aria-hidden="true" />
      </Link>
    ))}
  </nav>
);
