import { initReveal } from "./modules/reveal.js";
import { initShatter } from "./modules/shatter.js";
import { initSkillsTree } from "./modules/skills-tree.js";
import { initSkillsWalker } from "./modules/skills-walker.js";
import { initProjectCards } from "./modules/project-cards.js";
import { initTypewriter } from "./modules/typewriter.js";
import { initCopyButtons } from "./modules/copy-buttons.js";
import { initBackToTop } from "./modules/back-to-top.js";
import { initScrollProgress } from "./modules/scroll-progress.js";

// CSS hides [data-reveal] items only when this class exists, so a failed script never leaves them invisible
document.documentElement.classList.add("js");

initReveal();
initShatter();
initSkillsTree();
initSkillsWalker();
initProjectCards();
initTypewriter();
initCopyButtons();
initBackToTop();
initScrollProgress();
