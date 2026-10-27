/* CASE STUDIES */

import { caseStudies } from "../data/case-studies.js";

// INIT-CASE-STUDIES (export): opens a slide-in panel with the full story when a project card is clicked.
// The panel is a native <dialog>, so the browser handles focus trapping, the dark backdrop and Esc for us.
// In plain words: click a card, read the case study, close it and land back on the card.
export function initCaseStudies() {
    const panel = document.querySelector(".case");
    if (!panel) return;

    document.querySelectorAll(".project-card[data-case]").forEach((card) => {
        card.querySelector(".project-open").addEventListener("click", () => {
            const study = caseStudies[card.dataset.case];
            if (!study) return;

            fillPanel(panel, study);
            panel.showModal();
        });
    });

    panel.querySelector(".case-close").addEventListener("click", () => closePanel(panel));

    // clicks on the dark area outside the panel land on the <dialog> itself, never on its content
    panel.addEventListener("click", (event) => {
        if (event.target === panel) closePanel(panel);
    });

    // Esc fires "cancel"; preventDefault stops the instant close so the slide-out can play first
    panel.addEventListener("cancel", (event) => {
        event.preventDefault();
        closePanel(panel);
    });
}

// CLOSE-PANEL: plays the slide-out animation, then really closes the dialog.
// With reduced motion there is no animation, so "animationend" would never fire; we close right away instead.
// In plain words: slide away first, then shut.
function closePanel(panel) {
    if (panel.classList.contains("is-closing")) return;
    panel.classList.add("is-closing");

    const finish = () => {
        panel.classList.remove("is-closing");
        panel.close();
    };

    if (getComputedStyle(panel).animationName === "none") {
        finish();
        return;
    }
    panel.addEventListener("animationend", finish, { once: true });
}

// FILL-PANEL: writes one project's data into the panel.
// replaceChildren() empties an element and adds the new children in one step.
// In plain words: swap the old project's text for the new one.
function fillPanel(panel, study) {
    const status = panel.querySelector(".case-status");
    status.dataset.status = study.status;
    status.textContent = study.statusLabel;

    panel.querySelector(".case-title").textContent = study.title;
    panel.querySelector(".case-summary").textContent = study.summary;

    panel.querySelector(".case-sections").replaceChildren(
        buildSection("problem", study.problem),
        buildSection("approach", study.approach),
        buildSection("decisions", study.decisions),
        buildSection("result", study.result),
    );

    panel.querySelector(".case-stack").replaceChildren(
        ...study.stack.map((tech) => buildItem("li", tech)),
    );

    const link = panel.querySelector(".case-link");
    link.href = study.link.url;
    link.textContent = study.link.label;

    panel.scrollTop = 0;
}

// BUILD-SECTION: a heading plus either a paragraph (text) or a list (array of text).
// In plain words: one labelled block, like "//problem" and its text.
function buildSection(label, content) {
    const section = document.createElement("section");
    section.className = "case-section";

    const heading = document.createElement("h4");
    heading.className = "case-label";
    heading.textContent = `//${label}`;

    section.append(heading, Array.isArray(content) ? buildList(content) : buildItem("p", content));
    return section;
}

function buildList(items) {
    const list = document.createElement("ul");
    list.className = "case-list";
    list.append(...items.map((text) => buildItem("li", text)));
    return list;
}

// BUILD-ITEM: makes one element holding text; any text containing "TODO" gets flagged so it shows in amber.
// In plain words: create a line of text, and highlight it if it is still a placeholder.
function buildItem(tag, text) {
    const element = document.createElement(tag);
    element.textContent = text;
    element.classList.toggle("is-todo", text.includes("TODO"));
    return element;
}
