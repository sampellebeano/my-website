export const SkipLink = () => (
  <a
    className="skip-link"
    href="#main-content"
    onClick={(event) => {
      event.preventDefault();
      const main = document.getElementById("main-content");
      main?.focus({ preventScroll: true });
      main?.scrollIntoView();
    }}
  >
    Skip to content
  </a>
);
