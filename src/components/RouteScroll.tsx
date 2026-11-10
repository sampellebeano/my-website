import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

export const RouteScroll = () => {
  const { pathname, search } = useLocation();
  // Set the viewport before the project phone measures its destination.
  useLayoutEffect(() => {
    const entry = new URLSearchParams(search).get("entry");
    const target = entry ? document.getElementById(entry) : null;
    if (target) {
      if (!target.hasAttribute("tabindex")) target.tabIndex = -1;
      target.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
      target.focus({ preventScroll: true });
      return;
    }
    const main = document.getElementById("main-content");
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    main?.closest(".site-frame")?.scrollTo({ top: 0, left: 0, behavior: "instant" });
    main?.focus({ preventScroll: true });
  }, [pathname, search]);
  return null;
};
