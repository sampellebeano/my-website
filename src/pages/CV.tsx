import { useSearchParams } from "react-router-dom";
import { CVNavigation } from "@/components/CVNavigation";
import { PageHeading } from "@/components/PageHeading";
import { SiteShell } from "@/components/SiteShell";
import { entries, qualificationGroups, sections } from "@/data/cv";
import "./collection-views.css";

const CredentialLists = ({ heading: Heading }: { heading: "h2" | "h3" }) => (
  <div className="credential-lists">
    {qualificationGroups.map(group => (
      <div key={group.id} className="credential-group">
        <Heading id={group.id}>{group.title}</Heading>
        <ul role="list" aria-labelledby={group.id}>
          {group.credentials.map(credential => (
            <li key={credential.title}>
              <span>{credential.title}</span>
              <small>{credential.context}</small>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
);

const CV = () => {
  const [params] = useSearchParams();
  const selectedSection = sections.find(item => item.id === params.get("section"));
  const visibleSections = selectedSection ? [selectedSection] : sections;

  return (
    <SiteShell>
      <div className="cv-page">
        <PageHeading eyebrow="Sam Green" title={selectedSection?.label ?? "Full CV"} />
        <CVNavigation selectedSection={selectedSection?.id} />
        <div className="cv-content">
          {visibleSections.map(section => section.id === "qualifications" ? (
            selectedSection ? <CredentialLists key={section.id} heading="h2" /> : (
              <section key={section.id} aria-labelledby="cv-qualifications-title">
                <h2 id="cv-qualifications-title" className="cv-credentials-title">{section.label}</h2>
                <CredentialLists heading="h3" />
              </section>
            )
          ) : (
            <div key={section.id} className="article-list">
              {entries.filter(entry => entry.section === section.id).map(entry => (
                <article key={entry.id} className="content-article" aria-labelledby={`title-cv-${entry.id}`}>
                  <p className="article-context">{section.label} · {entry.context}</p>
                  <h2 id={`title-cv-${entry.id}`}>{entry.title}</h2>
                  {entry.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
                  {entry.id === "contact" && (
                    <div className="mt-4 flex flex-wrap gap-5">
                      <a className="nav-link" href="mailto:sam.jgreen@icloud.com">Email Sam</a>
                      <a className="nav-link" href="https://www.linkedin.com/in/samjohngreen" target="_blank" rel="noopener noreferrer">Connect on LinkedIn</a>
                    </div>
                  )}
                </article>
              ))}
            </div>
          ))}
        </div>
      </div>
    </SiteShell>
  );
};

export default CV;
