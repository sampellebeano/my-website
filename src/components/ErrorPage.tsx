import { Link } from "react-router-dom";
import { PageHeading } from "./PageHeading";
import { SiteShell } from "./SiteShell";

export const ErrorPage = ({ eyebrow, title, description, to, linkLabel }: { eyebrow: string; title: string; description: string; to: string; linkLabel: string }) => (
  <SiteShell layout="section">
    <section className="error-page">
      <PageHeading eyebrow={eyebrow} title={title} description={description} />
      <Link className="primary-link" to={to}>{linkLabel}</Link>
    </section>
  </SiteShell>
);
