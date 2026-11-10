import { Link } from "react-router-dom";
import { sections, type CVSection } from "@/data/cv";

export const CVNavigation = ({ selectedSection }: { selectedSection?: CVSection }) => (
  <nav aria-label="CV sections" className="collection-subnav">
    <Link className="nav-link" to="/cv" aria-current={selectedSection === undefined ? "page" : undefined}>All CV</Link>
    {sections.map((item) => (
      <Link key={item.id} to={`/cv?section=${item.id}`} className="nav-link" aria-current={selectedSection === item.id ? "page" : undefined}>
        {item.label}
      </Link>
    ))}
  </nav>
);
