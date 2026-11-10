import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { IPhoneShowcase } from "./IPhoneShowcase";
import { projects } from "@/data/projects";

interface DeviceStageProps {
  headingId: string;
  className?: string;
  intro: ReactNode;
  details?: ReactNode;
  selectedId?: string;
}

export const DeviceStage = ({ headingId, className = "", intro, details, selectedId }: DeviceStageProps) => {
  const navigate = useNavigate();
  const selected = projects.find(project => project.id === selectedId);
  return (
    <section className={`device-stage${className ? ` ${className}` : ""}`} aria-labelledby={headingId}>
      <div className="device-stage-copy">
        <div className="device-stage-intro">{intro}</div>
        {details && <div className="device-stage-details">{details}</div>}
      </div>
      <aside className="screen-phone" aria-label={selected ? `${selected.title} preview` : "Explore my apps"}>
        <IPhoneShowcase key={selectedId ?? "launcher"} selectedId={selectedId} onSelectProject={app => navigate(`/projects/${app.id}`)} onHome={() => navigate("/projects")} />
      </aside>
    </section>
  );
};
