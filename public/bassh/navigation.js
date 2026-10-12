const readingArea = document.getElementById("page-content");

if (readingArea) {
  const positionKey = "basshReadingPosition";
  const positions = new Map();
  let activeId = history.state?.[positionKey]?.id ?? crypto.randomUUID();

  const hashTarget = (hash) => {
    try {
      return document.getElementById(decodeURIComponent(hash.slice(1)));
    } catch {
      return null;
    }
  };

  const rememberPosition = () => {
    const top = readingArea.scrollTop;
    positions.set(activeId, top);
    history.replaceState({ ...history.state, [positionKey]: { id: activeId, top } }, "");
  };

  const restorePosition = () => {
    const saved = history.state?.[positionKey];
    activeId = saved?.id ?? crypto.randomUUID();
    const top = positions.get(activeId) ?? saved?.top;
    if (typeof top === "number") {
      readingArea.scrollTo({ top, behavior: "instant" });
    } else {
      hashTarget(location.hash)?.scrollIntoView({ behavior: "instant" });
    }
    rememberPosition();
  };

  // Keep live positions in memory; persist only when navigating or leaving.
  readingArea.addEventListener("scroll", () => positions.set(activeId, readingArea.scrollTop), { passive: true });
  window.addEventListener("pageshow", restorePosition);
  window.addEventListener("popstate", restorePosition);
  window.addEventListener("pagehide", rememberPosition);

  document.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest?.('a[href^="#"]');
    if (!link || link.hasAttribute("download") || (link.target && link.target !== "_self")) return;
    const target = hashTarget(link.hash);
    if (!target) return;

    event.preventDefault();
    rememberPosition();
    if (location.hash !== link.hash) {
      activeId = crypto.randomUUID();
      history.pushState({ ...history.state, [positionKey]: { id: activeId } }, "", link.hash);
    }
    // CSS supplies smooth scrolling and the reduced-motion preference.
    target.scrollIntoView();
    if (target.tabIndex < 0) target.tabIndex = -1;
    target.focus({ preventScroll: true });
  });
}
