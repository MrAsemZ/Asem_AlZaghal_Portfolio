/* COPY BUTTONS */

const RESET_AFTER = 1600; // ms before the button goes back to "copy"

// INIT-COPY-BUTTONS (export): every [data-copy] button copies its value to the clipboard when clicked.
// navigator.clipboard only works on https or localhost, which Live Server counts as.
// In plain words: click the button, the text is on your clipboard, and the button says so for a moment.
export function initCopyButtons() {
    document.querySelectorAll("[data-copy]").forEach((button) => {
        const label = button.textContent;

        button.addEventListener("click", async () => {
            try {
                await navigator.clipboard.writeText(button.dataset.copy);
                button.textContent = "copied ✓";
                button.classList.add("is-copied");
            } catch {
                button.textContent = "copy failed";
            }

            setTimeout(() => {
                button.textContent = label;
                button.classList.remove("is-copied");
            }, RESET_AFTER);
        });
    });
}
