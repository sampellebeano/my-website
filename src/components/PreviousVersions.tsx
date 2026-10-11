import { publicContent } from "@/data/public-content";
import { formatPublicDate } from "@/lib/public-content";

export const PreviousVersions = () => publicContent.versions.length ? (
  <details className="previous-versions">
    <summary>Previous versions</summary>
    <ul>
      {publicContent.versions.map(version => (
        <li key={version.id}>
          <a href={`${import.meta.env.BASE_URL}${version.path}`} className="text-link">{version.label}</a>
          <span className="version-date">Captured {formatPublicDate(version.capturedOn)}</span>
        </li>
      ))}
    </ul>
  </details>
) : null;
