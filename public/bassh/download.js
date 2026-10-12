const macDownload = document.getElementById("mac-download");
const floatingDownload = document.getElementById("floating-download");

if (macDownload && floatingDownload) {
  const updateDownload = () => {
    const shouldHide = macDownload.getBoundingClientRect().bottom > 0;
    if (shouldHide && document.activeElement === floatingDownload) {
      macDownload.focus({ preventScroll: true });
    }
    floatingDownload.hidden = shouldHide;
  };
  window.addEventListener("scroll", updateDownload, { passive: true });
  window.addEventListener("resize", updateDownload);
  updateDownload();
}
