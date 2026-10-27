let locks = 0;

/**
 * Stops the page behind a full-screen dialog from scrolling. Counted, so the
 * filter sheet closing over the phone map doesn't unlock the page under it.
 * Returns the release function; calling it twice is harmless.
 */
export function lockPageScroll() {
  locks += 1;
  document.documentElement.style.overflow = "hidden";
  let released = false;
  return () => {
    if (released) return;
    released = true;
    locks -= 1;
    if (locks === 0) document.documentElement.style.overflow = "";
  };
}
