const macDownload = document.getElementById("mac-download");
const floatingDownload = document.getElementById("floating-download");
const downloadDock = document.getElementById("download-dock");
const pageContent = document.getElementById("page-content");

if (macDownload && floatingDownload && downloadDock && pageContent) {
  const updateDownload = () => {
    const shouldHide = macDownload.getBoundingClientRect().bottom > 0;
    if (shouldHide && document.activeElement === floatingDownload) {
      macDownload.focus({ preventScroll: true });
    }
    floatingDownload.hidden = shouldHide;
    downloadDock.hidden = shouldHide;
  };
  window.addEventListener("scroll", updateDownload, { passive: true, capture: true });
  window.addEventListener("resize", updateDownload);
  updateDownload();

  // Forward paging when focus is outside the reading area; keep native controls intact.
  window.addEventListener("keydown", (event) => {
    if (event.defaultPrevented || (document.activeElement !== floatingDownload && document.activeElement !== document.body)) return;
    const pageStep = pageContent.clientHeight * 0.875;
    let top = pageContent.scrollTop;
    switch (event.key) {
      case "PageDown": top += pageStep; break;
      case "PageUp": top -= pageStep; break;
      case " ": top += event.shiftKey ? -pageStep : pageStep; break;
      case "ArrowDown": top = event.metaKey ? pageContent.scrollHeight : top + 40; break;
      case "ArrowUp": top = event.metaKey ? 0 : top - 40; break;
      case "Home": top = 0; break;
      case "End": top = pageContent.scrollHeight; break;
      default: return;
    }
    event.preventDefault();
    pageContent.scrollTo({ top });
  });
}
