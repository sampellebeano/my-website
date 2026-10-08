import { Link } from "react-router-dom";
import { sections } from "@/data/cv";

export const CVNavigation = () => (
  <nav aria-label="CV sections" className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
    {sections.map((item) => (
      <Link key={item.id} to={`/search?section=${item.id}`} className="nav-link">
        {item.label}
      </Link>
    ))}
  </nav>
);
