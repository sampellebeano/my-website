export const SkipLink = () => (
  <a
    className="skip-link"
    href="#main-content"
    onClick={(event) => {
      event.preventDefault();
      const main = document.getElementById("main-content");
      main?.focus();
      main?.scrollIntoView();
    }}
  >
    Skip to content
  </a>
);
