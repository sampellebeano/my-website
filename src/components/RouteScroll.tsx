import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const RouteScroll = () => {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    document.getElementById("main-content")?.focus({ preventScroll: true });
  }, [pathname, search]);
  return null;
};
