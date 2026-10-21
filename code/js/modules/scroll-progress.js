/* SCROLL PROGRESS */

// INIT-SCROLL-PROGRESS (export): keeps the --progress variable (0 to 1) in step with how far the page is scrolled.
// requestAnimationFrame limits the work to once per screen refresh, and { passive: true } promises the listener never blocks scrolling.
// In plain words: measure how far down the page you are, and hand that number to CSS to draw the line.
export function initScrollProgress() {
    const bar = document.querySelector(".scroll-progress");
    if (!bar) return;

    let isQueued = false;

    const update = () => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
        bar.style.setProperty("--progress", Math.min(Math.max(progress, 0), 1));
        isQueued = false;
    };

    const queueUpdate = () => {
        if (isQueued) return;
        isQueued = true;
        requestAnimationFrame(update);
    };

    window.addEventListener("scroll", queueUpdate, { passive: true });
    window.addEventListener("resize", queueUpdate);
    update();
}
