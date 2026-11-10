import { ArrowUpRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { DeviceStage } from "@/components/DeviceStage";
import { ProjectLinks } from "@/components/ProjectLinks";
import { SiteShell } from "@/components/SiteShell";

const Index = () => {
  return (
    <SiteShell>
      <DeviceStage headingId="home-title" className="home-screen" intro={
        <div className="home-copy">
          <p className="screen-kicker">Sam Green</p>
          <h1 id="home-title">I work in tech.<br />I also make apps<span className="accent-dot">.</span></h1>
          <p className="screen-lede">I’m a Solution Consultant at ServiceNow. Outside work, I’m building bassh, highlighter and Kapture. This is where I share what I’m up to.</p>
          <p className="location-line"><MapPin size={14} aria-hidden="true" /> Based in the UAE</p>
          <div className="screen-actions">
            <Link className="primary-link" to="/projects">What I’m building <ArrowUpRight size={16} aria-hidden="true" /></Link>
            <Link className="quiet-link" to="/experience">About my work</Link>
          </div>
        </div>
      } details={
        <section id="projects" className="home-projects" aria-labelledby="selected-work-title">
          <p id="selected-work-title" className="screen-kicker">Personal projects</p>
          <ProjectLinks compact />
        </section>
      } />
    </SiteShell>
  );
};

export default Index;
