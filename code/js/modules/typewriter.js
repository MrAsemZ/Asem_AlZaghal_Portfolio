/* TYPEWRITER */

import { onceVisible } from "./reveal.js";

// INIT-TYPEWRITER (export): types out every [data-typewriter] element the first time it scrolls into view.
// JS only measures the text and flips classes; CSS does the typing with steps().
// In plain words: work out how wide the text really is, then let CSS reveal it letter by letter.
export function initTypewriter() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    document.querySelectorAll("[data-typewriter]").forEach(async (element) => {
        // document.fonts.ready resolves once the webfonts are loaded, so the width we measure is the real one
        await document.fonts.ready;

        element.style.setProperty("--text-width", `${Math.ceil(element.getBoundingClientRect().width)}px`);
        element.style.setProperty("--chars", element.textContent.trim().length);
        element.classList.add("is-armed");

        element.addEventListener("animationend", (event) => {
            if (event.animationName === "type") element.classList.add("is-done");
        });

        onceVisible(element, () => element.classList.add("is-typing"), 0.6);
    });
}
