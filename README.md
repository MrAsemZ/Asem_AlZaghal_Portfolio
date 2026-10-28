# A'sem Al-Zaghal | Portfolio

![Portfolio preview](og-image.png)

**Live site:** https://mrasemz.github.io/Asem_AlZaghal_Portfolio

This is my personal portfolio. It is built with plain HTML, CSS and JavaScript, with no frameworks, libraries or build tools, because I wanted the site itself to show what I can do. The repository is public so recruiters and engineers can read the code behind it.

## What the site does

- **Break the code to enter:** the hero starts as a code editor. Click it and it shatters into 80 shards that fly away from the click point, revealing the real page.
- **Skill tree:** a game-style tree where a glowing dot walks through the pipes and unlocks each skill, then patrols the tree every few seconds. Branches collapse on click.
- **Journey map:** clickable pins along a route, built with radio inputs and no JavaScript.
- **Case studies:** each project card opens a slide-in panel with the problem, approach, decisions and result.
- **Services:** expandable rows, each linking to a project that proves it.
- **Contact:** the email types itself in on scroll, with copy buttons and a résumé download.
- **Details:** a scroll progress line, a back-to-top button, and five accent colors that are remembered between visits.

## Skills this project shows

| Skill | Where to see it |
|---|---|
| Modular architecture | CSS split into design tokens, base styles and one file per component. JavaScript split into ES modules, each exposing one `init` function. |
| Vanilla JavaScript | DOM building, recursion (skill tree), `async/await` (the walking dot), event delegation, `IntersectionObserver`, `ResizeObserver`, `requestAnimationFrame`. |
| Modern CSS | Custom properties, `:has()`, `color-mix()`, `@property` (smooth theme fade), `clip-path`, grid and flexbox. |
| Animation | Shatter physics from the click point, SVG path animation with `getPointAtLength`, staggered scroll reveals, CSS-only typewriter. |
| Accessibility | Semantic HTML, native `<dialog>` and `<details>`, keyboard support, visible focus, and full support for `prefers-reduced-motion`. |
| Responsive design | Built phone-first and checked on phone, tablet and desktop widths. |
| Product thinking | Case studies that explain decisions, services backed by real projects, copy buttons, link preview image. |
| Performance | No dependencies besides Google Fonts, passive scroll listeners, and work throttled to one update per frame. |

## How it is organized

The rule I followed: **JavaScript decides when, CSS decides how.** JS only adds a class or sets a CSS variable, and CSS does all the animating.

```
├── index.html
├── docs/                     résumé
├── design/                   source of the link preview image
└── code/
    ├── css/
    │   ├── main.css          only @imports, in order
    │   ├── tokens.css        colors, fonts, motion, accent themes
    │   ├── base.css          reset, typography, shared utilities
    │   ├── motion.css        keyframes, scroll reveal, reduced motion
    │   └── components/       one file per section or feature
    └── js/
        ├── main.js           starts every module
        ├── data/             case study content
        └── modules/          one file per feature
```

## Usage

© 2026 A'sem Al-Zaghal. All rights reserved.

This is a personal portfolio, not a template. The code, design and content are not licensed for copying, redistribution or deployment as your own. You are welcome to browse the live site and read the code to evaluate my work.

## Contact

I'm open to opportunities and project work.

- Email: alzaghal.asem@gmail.com
- LinkedIn: https://www.linkedin.com/in/asem-al-zaghal/
- GitHub: https://github.com/MrAsemZ
