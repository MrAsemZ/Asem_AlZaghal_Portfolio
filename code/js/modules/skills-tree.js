/* SKILLS TREE */

// Edit this object to change the tree: a node with `children` is a branch, without it a leaf.
const skillsTree = {
    name: "Skills",
    children: [
        { name: "Backend", children: [{ name: "Laravel" }, { name: "PHP" }, { name: "Java" }] },
        { name: "Frontend", children: [{ name: "React" }, { name: "JavaScript" }, { name: "HTML & CSS" }, { name: "Bootstrap" }] },
        { name: "Mobile", children: [{ name: "React Native" }] },
        { name: "Data", children: [{ name: "MySQL" }] },
        { name: "Tools", children: [{ name: "Git" }, { name: "Claude Code" }] },
    ],
};

// INIT-SKILLS-TREE (export): draws the tree into #skills-tree and enables click-to-collapse.
// In plain words: build the skills tree on the page and make the branches clickable.
export function initSkillsTree() {
    const treeElement = document.getElementById("skills-tree");
    if (!treeElement) return;

    treeElement.append(buildNode(skillsTree, true));
    treeElement.addEventListener("click", toggleBranch);
}

// BUILD-NODE (recursion): a function that calls itself once for every child in the data.
// In plain words: it makes one box, then asks itself to make every box hanging under it.
function buildNode(skill, isRoot = false) {
    const item = document.createElement("li");
    const isLeaf = !skill.children;

    const label = document.createElement(isLeaf ? "span" : "button");
    label.textContent = skill.name;
    label.className = "node";

    if (isLeaf) {
        item.append(label);
        return item;
    }

    label.type = "button";
    label.classList.add("node-branch");
    if (isRoot) label.classList.add("node-root");
    label.setAttribute("aria-expanded", "true");

    const children = document.createElement("ul");
    skill.children.forEach((child) => children.append(buildNode(child)));

    item.append(label, children);
    return item;
}

// TOGGLE-BRANCH (event delegation): one click listener on the whole tree instead of one per button.
// closest() climbs from whatever was clicked up to the nearest branch button, and
// classList.toggle() returns true when the class was just added.
// In plain words: listen once at the top, then work out which button was pressed.
function toggleBranch(event) {
    const button = event.target.closest(".node-branch");
    if (!button) return;

    const isCollapsed = button.parentElement.classList.toggle("collapsed");
    button.setAttribute("aria-expanded", String(!isCollapsed));
}
