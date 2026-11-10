for (const figure of document.querySelectorAll(".app-screenshot[data-recording]")) {
  const image = figure.querySelector("img");
  const button = figure.querySelector(".demo-toggle");
  if (!image || !button) continue;
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  let playing = !preference.matches;
  const render = () => {
    image.src = playing ? figure.dataset.recording : figure.dataset.poster;
    figure.querySelector("source")?.remove();
    button.textContent = playing ? "Pause demo" : "Play demo";
    button.setAttribute("aria-label", `${playing ? "Pause" : "Play"} ${figure.dataset.app} demo`);
    button.hidden = false;
  };
  button.addEventListener("click", () => { playing = !playing; render(); });
  preference.addEventListener("change", () => { if (preference.matches) { playing = false; render(); } });
  render();
}
