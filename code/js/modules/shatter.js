/* SHATTER PANEL */

// Defaults can be overridden per panel: <div data-shatter data-cols="10" data-rows="6">
const DEFAULTS = { cols: 8, rows: 5, jitter: 0.35 };

// How violent the explosion is (distances in px, delay in ms).
const FORCE = { base: 180, extra: 520, scatter: 160, gravity: 140, delay: 90 };

// INIT-SHATTER (export): finds every [data-shatter] panel in the HTML and makes it breakable.
// In plain words: look for each glass panel on the page and wire it up.
export function initShatter() {
    document.querySelectorAll("[data-shatter]").forEach(setupPanel);
}

// SETUP-PANEL: builds the shards once, then listens for "break" and "show code" clicks.
// In plain words: prepare one panel so it can break and be put back together.
function setupPanel(panel) {
    const code = panel.querySelector(".shatter-code");
    const real = panel.querySelector(".shatter-real");
    const cols = Number(panel.dataset.cols) || DEFAULTS.cols;
    const rows = Number(panel.dataset.rows) || DEFAULTS.rows;

    const shards = buildShards(cols, rows, DEFAULTS.jitter);
    const layer = document.createElement("div");
    layer.className = "shatter-shards";
    layer.append(...shards.map((shard) => shard.element));
    panel.append(layer);

    real.inert = true;
    panel.classList.add("is-ready");

    panel.querySelector(".shatter-trigger").addEventListener("click", (event) => {
        const box = panel.getBoundingClientRect();
        // click.detail is 0 when the click came from the keyboard, so aim at the middle
        const hit = event.detail === 0
            ? { x: box.width / 2, y: box.height / 2 }
            : { x: event.clientX - box.left, y: event.clientY - box.top };

        throwShards(shards, box, hit);
        setVars(panel, { "impact-x": `${hit.x}px`, "impact-y": `${hit.y}px` });
        panel.classList.add("is-broken");
        code.inert = true;
        real.inert = false;
    });

    panel.querySelector(".shatter-reset").addEventListener("click", () => {
        panel.classList.remove("is-broken");
        code.inert = false;
        real.inert = true;
    });
}

// BUILD-SHARDS: lays a jittered grid over the panel and cuts every cell into 2 triangles.
// In plain words: crack the glass into random triangles that still fit together perfectly.
function buildShards(cols, rows, jitter) {
    const grid = makeGrid(cols, rows, jitter);
    const shards = [];

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const topLeft = grid[row][col];
            const topRight = grid[row][col + 1];
            const bottomRight = grid[row + 1][col + 1];
            const bottomLeft = grid[row + 1][col];

            const triangles = Math.random() < 0.5
                ? [[topLeft, topRight, bottomRight], [topLeft, bottomRight, bottomLeft]]
                : [[topLeft, topRight, bottomLeft], [topRight, bottomRight, bottomLeft]];

            triangles.forEach((points) => shards.push(createShard(points)));
        }
    }
    return shards;
}

// MAKE-GRID: a 2D array of corner points (in % of the panel); inner corners are nudged randomly.
// Array.from({ length: n }, fn) is a shortcut for "build an array of n items using fn".
// In plain words: a net of dots over the panel, where the inner dots are wiggled so cracks look natural.
function makeGrid(cols, rows, jitter) {
    const stepX = 100 / cols;
    const stepY = 100 / rows;
    const wiggle = (step) => (Math.random() * 2 - 1) * jitter * step;

    return Array.from({ length: rows + 1 }, (_, row) =>
        Array.from({ length: cols + 1 }, (_, col) => {
            const onEdgeX = col === 0 || col === cols;
            const onEdgeY = row === 0 || row === rows;
            return {
                x: col * stepX + (onEdgeX ? 0 : wiggle(stepX)),
                y: row * stepY + (onEdgeY ? 0 : wiggle(stepY)),
            };
        })
    );
}

// CREATE-SHARD: makes one <span> sized to the triangle's bounding box and clipped to its shape.
// In plain words: turn three points into one flat piece of glass.
function createShard(points) {
    const xs = points.map((point) => point.x);
    const ys = points.map((point) => point.y);
    const left = Math.min(...xs);
    const top = Math.min(...ys);
    const width = Math.max(...xs) - left;
    const height = Math.max(...ys) - top;
    const center = {
        x: (xs[0] + xs[1] + xs[2]) / 3,
        y: (ys[0] + ys[1] + ys[2]) / 3,
    };

    const clip = points
        .map((point) => `${(((point.x - left) / width) * 100).toFixed(1)}% ${(((point.y - top) / height) * 100).toFixed(1)}%`)
        .join(", ");

    const element = document.createElement("span");
    element.className = "shatter-shard";
    setVars(element, {
        x: `${left}%`,
        y: `${top}%`,
        w: `${width}%`,
        h: `${height}%`,
        clip: `polygon(${clip})`,
        ox: `${((center.x - left) / width) * 100}%`,
        oy: `${((center.y - top) / height) * 100}%`,
    });

    return { element, center };
}

// THROW-SHARDS: gives each shard a direction, distance, spin and delay based on where the click landed.
// Shards near the hit fly farther and start first, so a shockwave spreads out from the click.
// In plain words: push every piece away from the click, hardest for the pieces closest to it.
function throwShards(shards, box, hit) {
    const reach = Math.hypot(box.width, box.height);

    shards.forEach(({ element, center }) => {
        const dx = (center.x / 100) * box.width - hit.x;
        const dy = (center.y / 100) * box.height - hit.y;
        const distance = Math.hypot(dx, dy) || 1;
        const power = 1 - Math.min(distance / reach, 1);
        const push = FORCE.base + power * FORCE.extra + Math.random() * FORCE.scatter;

        setVars(element, {
            tx: `${(dx / distance) * push}px`,
            ty: `${(dy / distance) * push + Math.random() * FORCE.gravity}px`,
            rot: `${(Math.random() - 0.5) * (360 + power * 720)}deg`,
            d: `${(distance / reach) * FORCE.delay}ms`,
        });
    });
}

// SET-VARS: writes a { name: value } object onto an element as CSS custom properties (--name).
// Object.entries turns the object into [name, value] pairs we can loop over.
// In plain words: hand values from JS to CSS so CSS can do the animating.
function setVars(element, vars) {
    Object.entries(vars).forEach(([name, value]) => element.style.setProperty(`--${name}`, value));
}
