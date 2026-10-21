/* REVEAL */

// ONCE-VISIBLE (export): runs `callback` one time, the first time `element` is on screen.
// IntersectionObserver is a browser tool that reports when an element enters the viewport.
// In plain words: wait until the visitor scrolls to it, then start, once.
export function onceVisible(element, callback, threshold = 0.3) {
    if (!("IntersectionObserver" in window)) {
        callback();
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        callback();
    }, { threshold });

    observer.observe(element);
}

// WATCH-VISIBLE (export): calls `onChange(true or false)` every time `element` enters or leaves the screen.
// In plain words: keep telling me whether it is on screen right now.
export function watchVisible(element, onChange, threshold = 0.3) {
    if (!("IntersectionObserver" in window)) {
        onChange(true);
        return;
    }

    const observer = new IntersectionObserver(([entry]) => onChange(entry.isIntersecting), { threshold });
    observer.observe(element);
}

// INIT-REVEAL (export): fades up every [data-reveal] element the first time it scrolls into view.
// Each element gets --i (its position among its siblings) so CSS can stagger them.
// In plain words: things float in one after another as you scroll down to them.
export function initReveal() {
    const items = document.querySelectorAll("[data-reveal]");

    items.forEach((item) => {
        const siblings = [...item.parentElement.querySelectorAll(":scope > [data-reveal]")];
        item.style.setProperty("--i", siblings.indexOf(item));
    });

    if (!("IntersectionObserver" in window)) {
        items.forEach((item) => item.classList.add("is-visible"));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.filter((entry) => entry.isIntersecting).forEach((entry) => {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.15 });

    items.forEach((item) => observer.observe(item));
}
