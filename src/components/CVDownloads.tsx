import { FileDown } from "lucide-react";
import { cvDownloads } from "@/data/cv";

export const CVDownloads = () => (
  <div className="flex flex-wrap items-center gap-3 text-sm">
    <a href={cvDownloads.pdf} download className="download-link">
      <FileDown size={16} aria-hidden="true" /> CV (PDF)
    </a>
    <a href={cvDownloads.word} download className="download-link secondary-download">
      <FileDown size={16} aria-hidden="true" /> CV (Word)
    </a>
  </div>
);
