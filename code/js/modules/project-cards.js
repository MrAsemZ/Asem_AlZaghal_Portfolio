/* PROJECT CARDS */

// INIT-PROJECT-CARDS (export): lets each card's glow follow the cursor.
// pointermove covers mouse, pen and touch in one event.
// In plain words: tell CSS where the mouse is inside each card, and CSS paints the glow there.
export function initProjectCards() {
    document.querySelectorAll(".project-card").forEach((card) => {
        card.addEventListener("pointermove", (event) => {
            const box = card.getBoundingClientRect();
            card.style.setProperty("--mx", `${event.clientX - box.left}px`);
            card.style.setProperty("--my", `${event.clientY - box.top}px`);
        });
    });
}
