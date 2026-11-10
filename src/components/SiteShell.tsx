import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { SiteNavigation } from "./SiteNavigation";
import { CVDownloads } from "./CVDownloads";
import { CVFooter } from "./CVFooter";
import { PreviousVersions } from "./PreviousVersions";
import { SkipLink } from "./SkipLink";
import "./single-screen.css";

export const SiteShell = ({ children, layout }: { children: ReactNode; layout?: "section" | "wide-section" }) => {
  const { pathname } = useLocation();
  const routePath = pathname.replace(/\/+$/, "") || "/";
  const documentView = ["/cv", "/updates", "/books"].includes(routePath);
  const sectionView = Boolean(layout) || (routePath !== "/" && routePath !== "/projects" && !routePath.startsWith("/projects/"));
  const wideView = layout === "wide-section";
  return (
    <div className={`site-frame${documentView ? " site-frame--document" : ""}${sectionView ? " site-frame--section" : ""}${wideView ? " site-frame--wide" : ""}`}>
      <SkipLink />
      <header className="site-header">
        <Link to="/" className="identity-name" aria-label="Sam Green home"><img src={`${import.meta.env.BASE_URL}favicon.png`} width="40" height="40" alt="" /></Link>
        <SiteNavigation />
      </header>
      <main id="main-content" tabIndex={-1} className="site-main">{children}</main>
      <footer className="site-footer">
        <CVFooter />
        <div className="footer-tools"><Link className="nav-link" to="/cv">Full CV</Link><CVDownloads /><PreviousVersions /></div>
      </footer>
    </div>
  );
};
