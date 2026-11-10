import type { ReactNode } from "react";

interface PageHeadingProps {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  id?: string;
  className?: string;
}

export const PageHeading = ({ eyebrow, title, description, id, className = "" }: PageHeadingProps) => (
  <header className={`page-heading${className ? ` ${className}` : ""}`}>
    <p className="eyebrow">{eyebrow}</p>
    <h1 id={id}>{title}</h1>
    {description && <p>{description}</p>}
  </header>
);
