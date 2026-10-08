import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { SiteNavigation } from "./SiteNavigation";
import { SearchBox } from "./SearchBox";
import { CVDownloads } from "./CVDownloads";
import { CVFooter } from "./CVFooter";
import { PreviousVersions } from "./PreviousVersions";
import { SkipLink } from "./SkipLink";

export const SiteShell = ({ children }: { children: ReactNode }) => {
  const { search } = useLocation();
  const query = new URLSearchParams(search).get("query") ?? "";
  return (
    <div className="site-frame">
      <SkipLink />
      <aside className="site-sidebar" aria-label="Sam Green and website navigation">
        <header>
          <Link to="/" className="identity-name" aria-label="Sam Green home">Sam Green<span aria-hidden="true">.</span></Link>
          <p className="identity-role">Senior Solution Consultant<br /><span>ServiceNow · UAE</span></p>
          <p className="identity-about">I connect enterprise business priorities with ServiceNow solutions. A background in solution engineering, a curiosity for what comes next.</p>
        </header>
        <SiteNavigation />
        <SearchBox key={search} initialQuery={query} />
        <div className="sidebar-links">
          <CVDownloads />
          <Link className="text-link full-cv-link" to="/search">View full CV <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="sidebar-bottom">
          <CVFooter />
          <PreviousVersions />
        </div>
      </aside>
      <main id="main-content" tabIndex={-1} className="site-main">{children}</main>
    </div>
  );
};
