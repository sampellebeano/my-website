import { useEffect, useId, useState } from "react";
import type { PersonalProject } from "@/data/projects";

export const AppScreenshot = ({ screenshot, appName }: { screenshot: NonNullable<PersonalProject["screenshot"]>; appName: string }) => {
  const [playing, setPlaying] = useState(() => typeof window === "undefined" || !window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const imageId = useId();
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const stop = () => { if (preference.matches) setPlaying(false); };
    preference.addEventListener("change", stop);
    return () => preference.removeEventListener("change", stop);
  }, []);
  return (
    <figure className="app-screenshot">
      <a className="screenshot-link" href={screenshot.src} target="_blank" rel="noreferrer" aria-label={`${appName}: ${screenshot.caption} View recording at full size (opens in a new tab)`}>
        <div className="iphone-frame">
          <img id={imageId} src={playing ? screenshot.src : screenshot.poster} alt={screenshot.alt} width={screenshot.width} height={screenshot.height} loading="lazy" decoding="async" />
        </div>
      </a>
      <figcaption><span>{screenshot.caption}</span><button className="demo-toggle" type="button" aria-controls={imageId} aria-label={`${playing ? "Pause" : "Play"} ${appName} demo`} onClick={() => setPlaying(value => !value)}>{playing ? "Pause demo" : "Play demo"}</button></figcaption>
    </figure>
  );
};
