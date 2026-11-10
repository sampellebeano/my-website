const readingFrame = document.querySelector(".page-content, .project-frame");

// Keep document paging available when the paper frame owns scrolling.
window.addEventListener("keydown", (event) => {
  if (event.defaultPrevented || document.activeElement !== document.body ||
      !readingFrame || readingFrame.scrollHeight <= readingFrame.clientHeight) return;

  const pageStep = readingFrame.clientHeight * 0.875;
  let top = readingFrame.scrollTop;
  switch (event.key) {
    case "PageDown": top += pageStep; break;
    case "PageUp": top -= pageStep; break;
    case " ": top += event.shiftKey ? -pageStep : pageStep; break;
    case "ArrowDown": top = event.metaKey ? readingFrame.scrollHeight : top + 40; break;
    case "ArrowUp": top = event.metaKey ? 0 : top - 40; break;
    case "Home": top = 0; break;
    case "End": top = readingFrame.scrollHeight; break;
    default: return;
  }
  event.preventDefault();
  readingFrame.scrollTo({ top });
});
