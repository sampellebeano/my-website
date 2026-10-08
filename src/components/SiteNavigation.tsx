import { NavLink } from "react-router-dom";

const destinations = [
  { path: "/", label: "Overview" },
  { path: "/experience", label: "Experience" },
  { path: "/projects", label: "Projects" },
];

export const SiteNavigation = () => (
  <nav aria-label="Main navigation" className="site-navigation">
    {destinations.map(destination => (
      <NavLink key={destination.path} to={destination.path} end={destination.path === "/"}
        className={({ isActive }) => `site-nav-link${isActive ? " is-active" : ""}`}>
        <span aria-hidden="true" className="nav-marker" />{destination.label}
      </NavLink>
    ))}
  </nav>
);
