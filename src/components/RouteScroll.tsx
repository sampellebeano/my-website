import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const RouteScroll = () => {
  const { pathname, search } = useLocation();
  useEffect(() => {
    const entry = new URLSearchParams(search).get("entry");
    const target = entry ? document.getElementById(entry) : null;
    if (target) {
      if (!target.hasAttribute("tabindex")) target.tabIndex = -1;
      target.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
      target.focus({ preventScroll: true });
      return;
    }
    window.scrollTo(0, 0);
    document.getElementById("main-content")?.focus({ preventScroll: true });
  }, [pathname, search]);
  return null;
};
