import { NavLink } from "react-router-dom";
import { publicContent } from "@/data/public-content";

const destinations = [
  { path: "/", label: "Home" },
  { path: "/projects", label: "Projects" },
  { path: "/experience", label: "Experience" },
];

export const SiteNavigation = () => (
  <nav aria-label="Main navigation" className="site-navigation">
    {[...destinations,
      ...(publicContent.activity.length ? [{ path: "/updates", label: "Updates" }] : []),
      ...(publicContent.books.length ? [{ path: "/books", label: "Books" }] : []),
    ].map(destination => (
      <NavLink key={destination.path} to={destination.path} end={destination.path === "/"}
        className={({ isActive }) => `site-nav-link${isActive ? " is-active" : ""}`}>
        <span aria-hidden="true" className="nav-marker" />{destination.label}
      </NavLink>
    ))}
  </nav>
);
