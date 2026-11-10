import { ArrowUpRight, MapPin } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { IPhoneShowcase } from "@/components/IPhoneShowcase";
import { ProjectLinks } from "@/components/ProjectLinks";
import { SiteShell } from "@/components/SiteShell";

const Index = () => {
  const navigate = useNavigate();
  return (
    <SiteShell>
      <section className="home-screen" aria-labelledby="home-title">
        <div className="home-copy">
          <p className="screen-kicker">Sam Green</p>
          <h1 id="home-title">Technology, AI & building things<span className="accent-dot">.</span></h1>
          <p className="screen-lede">I work on enterprise technology at ServiceNow. Outside work, I build apps for creators, remote development and running.</p>
          <p className="location-line"><MapPin size={14} aria-hidden="true" /> Based in the UAE</p>
          <div className="screen-actions">
            <Link className="primary-link" to="/projects">Explore my projects <ArrowUpRight size={16} aria-hidden="true" /></Link>
            <Link className="quiet-link" to="/experience">About my work</Link>
          </div>
        </div>
        <aside className="screen-phone" aria-label="Explore my apps">
          <IPhoneShowcase onSelectProject={app => navigate(`/projects/${app.id}`)} />
        </aside>
        <section id="projects" className="home-projects" aria-labelledby="selected-work-title">
          <p id="selected-work-title" className="screen-kicker">Personal projects</p>
          <ProjectLinks compact />
        </section>
      </section>
    </SiteShell>
  );
};

export default Index;
