/* BACK TO TOP */

import { watchVisible } from "./reveal.js";

// INIT-BACK-TO-TOP (export): shows the floating arrow once the hero has scrolled away, and hides it again near the footer.
// In plain words: the arrow appears when you are somewhere in the middle of the page, and only then.
export function initBackToTop() {
    const button = document.querySelector(".to-top-float");
    const hero = document.getElementById("home");
    const footer = document.getElementById("footer");
    if (!button || !hero || !footer) return;

    let heroOnScreen = true;
    let footerOnScreen = false;
    const update = () => button.classList.toggle("is-visible", !heroOnScreen && !footerOnScreen);

    watchVisible(hero, (visible) => { heroOnScreen = visible; update(); }, 0.1);
    watchVisible(footer, (visible) => { footerOnScreen = visible; update(); }, 0.1);
}
