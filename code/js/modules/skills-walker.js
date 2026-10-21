/* SKILLS WALKER */

import { onceVisible, watchVisible } from "./reveal.js";

// speed is px per second; the other numbers are milliseconds
const WALK = { speed: 900, minStep: 130, pause: 110, loopDelay: 5000 };
const SVG_NS = "http://www.w3.org/2000/svg";

const nodeOf = (item) => item.querySelector(":scope > .node");
const childItems = (item) => [...item.querySelectorAll(":scope > ul > li")];

// INIT-SKILLS-WALKER (export): draws the pipes between nodes, then sends a glowing dot through the tree.
// `?.` returns undefined instead of crashing when the element is missing.
// In plain words: when the tree scrolls into view the dot unlocks it, then walks it again every few seconds.
export function initSkillsWalker() {
    const stage = document.querySelector(".tree-stage");
    const rootItem = stage?.querySelector(".tree > li");
    if (!rootItem) return;

    const edges = createEdges(createLayers(stage.querySelector(".tree-lines")), rootItem);
    const redraw = () => drawEdges(stage, edges);

    redraw();
    new ResizeObserver(redraw).observe(stage);
    stage.addEventListener("click", () => requestAnimationFrame(redraw));

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        edges.forEach((edge) => { edge.isLit = true; });
        stage.querySelectorAll(".node").forEach((node) => node.classList.add("is-lit"));
        redraw();
        return;
    }

    let isOnScreen = false;
    watchVisible(stage, (visible) => { isOnScreen = visible; });

    const context = { stage, edges, dot: stage.querySelector(".tree-dot") };
    onceVisible(stage, () => patrol(context, rootItem, () => isOnScreen));
}

// PATROL: the first walk unlocks the tree; after that the dot walks it again every few seconds, only while it is on screen.
// `while (true)` never ends by itself: it is an endless loop that sleeps between rounds.
// In plain words: unlock everything once, then keep a dot patrolling the pipes.
async function patrol(context, rootItem, isOnScreen) {
    await walk(context, rootItem);

    while (true) {
        await wait(WALK.loopDelay);
        if (isOnScreen() && !document.hidden) await walk(context, rootItem);
    }
}

// CREATE-LAYERS: three stacked SVG groups, wall at the bottom, glowing fill on top.
// Stacking by layer (not by pipe) is what makes pipes that share a start point merge cleanly.
// In plain words: all the pipe walls go underneath, all the glowing liquid goes on top.
function createLayers(svg) {
    const makeGroup = () => svg.appendChild(document.createElementNS(SVG_NS, "g"));
    return { wall: makeGroup(), channel: makeGroup(), fill: makeGroup() };
}

// CREATE-EDGES (recursion): makes the three pipe layers for every parent-to-child link.
// `:scope >` means "direct children only", so grandchildren are skipped.
// In plain words: for every box and the boxes under it, prepare the pipe that joins them.
function createEdges(layers, item, edges = []) {
    childItems(item).forEach((childItem) => {
        edges.push({
            parent: nodeOf(item),
            child: nodeOf(childItem),
            wall: createPath(layers.wall, "tree-pipe-wall"),
            channel: createPath(layers.channel, "tree-pipe-channel"),
            fill: createPath(layers.fill, "tree-pipe-fill"),
            isLit: false,
        });
        createEdges(layers, childItem, edges);
    });
    return edges;
}

// CREATE-PATH: adds one <path> to an SVG group.
// createElementNS is needed because SVG tags live in their own namespace; plain createElement would make an unknown HTML tag.
// In plain words: make one line shape inside the drawing layer.
function createPath(group, className) {
    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("class", className);
    group.append(path);
    return path;
}

// DRAW-EDGES: re-measures every node and redraws each pipe as a smooth S-curve (a cubic Bezier).
// The glowing fill is hidden with a dash trick: dasharray = its length, dashoffset = its length.
// In plain words: connect the boxes with curved pipes, and keep them right when the layout changes.
function drawEdges(stage, edges) {
    const origin = stage.getBoundingClientRect();

    edges.forEach((edge) => {
        const paths = [edge.wall, edge.channel, edge.fill];
        const isVisible = edge.child.offsetParent !== null; // null means a collapsed branch is hiding it
        paths.forEach((path) => path.classList.toggle("is-hidden", !isVisible));
        if (!isVisible) return;

        const from = centerOf(edge.parent, origin);
        const to = centerOf(edge.child, origin);
        const midX = (from.x + to.x) / 2;
        const curve = `M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`;
        paths.forEach((path) => path.setAttribute("d", curve));

        const length = edge.wall.getTotalLength();
        edge.fill.style.strokeDasharray = length;
        edge.fill.style.strokeDashoffset = edge.isLit ? 0 : length;
    });
}

// CENTER-OF: the middle of an element, measured from the stage's top-left corner.
// In plain words: where on the stage does this box sit?
function centerOf(element, origin) {
    const box = element.getBoundingClientRect();
    return {
        x: box.left + box.width / 2 - origin.left,
        y: box.top + box.height / 2 - origin.top,
    };
}

// WALK: puts the dot on the root, unlocks it, then explores the whole tree.
// In plain words: one full trip through the pipes.
async function walk(context, rootItem) {
    const { stage, dot } = context;
    const rootNode = nodeOf(rootItem);

    moveDot(dot, centerOf(rootNode, stage.getBoundingClientRect()));
    stage.classList.add("is-walking");
    await wait(WALK.pause);

    rootNode.classList.add("is-lit");
    await wait(WALK.pause);

    await visit(context, rootItem, false);
    stage.classList.remove("is-walking");
}

// VISIT (recursion): walks into each child, unlocks it, explores below it, and only walks back up if something is left to do.
// `comeBack` tells a branch whether the dot still has other places to go afterwards.
// In plain words: go down, unlock, look around, and come back only when there is more to explore.
async function visit(context, item, comeBack) {
    const children = childItems(item);

    for (const [index, childItem] of children.entries()) {
        const edge = context.edges.find((candidate) => candidate.child === nodeOf(childItem));
        const needsReturn = comeBack || index < children.length - 1;

        await travel(context, edge, "down");
        edge.child.classList.add("is-lit");
        await wait(WALK.pause);

        await visit(context, childItem, needsReturn);
        if (needsReturn) await travel(context, edge, "up");
    }
}

// TRAVEL: slides the dot along one pipe; the first time down, it also fills the pipe behind it.
// getPointAtLength(n) returns the x/y point n pixels along an SVG path; smoothstep (3t² - 2t³) makes it ease in and out.
// In plain words: move the dot along the pipe, leaving a glowing trail the first time through.
async function travel(context, edge, direction) {
    if (edge.wall.classList.contains("is-hidden")) return;

    const length = edge.wall.getTotalLength();
    const goingDown = direction === "down";
    const duration = Math.max(WALK.minStep, (length / WALK.speed) * 1000);

    await animate(duration, (progress) => {
        const eased = progress * progress * (3 - 2 * progress);
        moveDot(context.dot, edge.wall.getPointAtLength(goingDown ? length * eased : length * (1 - eased)));
        if (goingDown && !edge.isLit) edge.fill.style.strokeDashoffset = length * (1 - eased);
    });

    if (goingDown) edge.isLit = true;
}

// ANIMATE: calls `onFrame(0..1)` on every screen refresh for `duration` ms, and resolves when done.
// requestAnimationFrame runs the callback right before each repaint, so motion stays smooth.
// In plain words: a small timer that reports "how far along are we" while the dot moves.
function animate(duration, onFrame) {
    return new Promise((resolve) => {
        const start = performance.now();

        function frame(now) {
            const progress = Math.min((now - start) / duration, 1);
            onFrame(progress);
            if (progress < 1) requestAnimationFrame(frame);
            else resolve();
        }
        requestAnimationFrame(frame);
    });
}

// MOVE-DOT: hands the dot's position to CSS through the --x and --y variables.
// In plain words: JS says where the dot is, CSS actually draws it there.
function moveDot(dot, point) {
    dot.style.setProperty("--x", point.x);
    dot.style.setProperty("--y", point.y);
}

// WAIT: pauses an async function for `ms` milliseconds.
// In plain words: hold on for a moment.
function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
