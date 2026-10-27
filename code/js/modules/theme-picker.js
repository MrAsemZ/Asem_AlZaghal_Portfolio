/* THEME PICKER */

// INIT-THEME-PICKER (export): lets visitors pick an accent color and remembers it for next time.
// JS only writes data-accent on <html>; CSS decides what each name looks like.
// localStorage can throw (for example in private browsing), so saving is wrapped in try/catch and quietly skipped if it fails.
// In plain words: click a color dot, the whole site changes color, and it is still that color on the next visit.
export function initThemePicker() {
    const swatches = document.querySelectorAll(".theme-swatch");
    if (!swatches.length) return;

    const apply = (name) => {
        document.documentElement.dataset.accent = name;
        swatches.forEach((swatch) => swatch.setAttribute("aria-pressed", String(swatch.dataset.accent === name)));
    };

    apply(document.documentElement.dataset.accent || "lime");

    swatches.forEach((swatch) => {
        swatch.addEventListener("click", () => {
            apply(swatch.dataset.accent);

            try {
                localStorage.setItem("accent", swatch.dataset.accent);
            } catch {}
        });
    });
}
