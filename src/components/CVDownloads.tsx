import { FileDown } from "lucide-react";
import { cvDownloads } from "@/data/cv";

export const CVDownloads = () => (
  <div className="cv-downloads">
    <a href={cvDownloads.pdf} download className="download-link"><FileDown size={15} aria-hidden="true" /> CV (PDF)</a>
    <a href={cvDownloads.word} download className="download-link">CV (Word)</a>
  </div>
);
