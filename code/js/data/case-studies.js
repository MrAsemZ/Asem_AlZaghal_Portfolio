/* CASE STUDIES: the words shown in the slide-in panel. Edit the text here, no other file needs to change. */

export const caseStudies = {
    rasin: {
        title: "Rasin",
        status: "progress",
        statusLabel: "in progress",
        summary: "AI bookkeeper for small businesses, categorizing and tax filing, with every AI decision shown and reversible.",
        problem: "Small business owners spend hours every month sorting transactions and preparing taxes. Accountants are expensive, and mistakes can cost penalties.",
        approach: "I started with one narrow job, categorizing transactions, because it's repetitive and everyone needs it. Tax filing comes after, once owners trust the results.",
        decisions: [
            "Trust comes before automation: the AI shows every decision with its reason, and the owner can reverse any of them.",
            "Real accounting underneath: double-entry books, so the numbers hold up with an accountant or the tax office.",
            "Trade-off: the owner reviews suggestions instead of getting full autopilot. That's slower, but safer for money.",
        ],
        result: "In progress. Collecting signups while I keep developing it. Next: tax filing.",
        stack: ["SaaS", "AI", "double-entry"],
        link: { label: "Visit Rasin ↗", url: "https://ai-rasin.com/" },
    },

    boutique: {
        title: "Boutique",
        status: "live",
        statusLabel: "live",
        summary: "Multi-vendor clothing marketplace, vendor onboarding, catalog, orders, and payments.",
        problem: "Small clothing sellers had no single place to open a shop, list products and get paid.",
        approach: "Database first (vendors, products, orders), then a Laravel API, then a React storefront and a React Native app that both use the same API. I built it with Claude Code.",
        decisions: [
            "One API serves both web and mobile, so the logic is written once.",
            "Role-based access: vendors only see their own products and orders.",
            "A single cart is split into one order per vendor at checkout. This is harder to build, but shoppers only pay once.",
        ],
        result: "Live, covering the flow from vendor signup to payment. It also shows my proficiency in building with AI coding agents.",
        stack: ["Laravel", "React", "React Native", "Claude Code"],
        link: { label: "Visit Boutique ↗", url: "https://boutique-xi-nine.vercel.app/" },
    },

    wise: {
        title: "WISE Guide",
        status: "shipped",
        statusLabel: "shipped",
        summary: "Campus assistant app helping students navigate schedules, buildings, and university services.",
        problem: "Students wasted time finding schedules, buildings and university services across scattered pages.",
        approach: "A Flutter app with one screen per need (schedules, campus buildings, services) and a chatbot on top that answers questions in plain language.",
        decisions: [
            "Flutter gave me one codebase for Android and iOS.",
            "The chatbot matches the question to a fixed set of topics before answering, so it doesn't invent campus information.",
        ],
        result: "Shipped as my graduation project, built with a real user base in mind.",
        stack: ["Flutter", "Chatbot", "Graduation project"],
        link: { label: "View on GitHub ↗", url: "https://github.com/MrAsemZ/WISE-Guide.git" },
    },

    wms: {
        title: "WMS",
        status: "shipped",
        statusLabel: "shipped",
        summary: "Warehouse Management System that manages warehouses, stock levels, item importing and exporting, and multiple storages.",
        problem: "Stock counts drifted because imports, exports and storage locations were tracked in separate places, so nobody could trust the numbers.",
        approach: "I designed the schema first (warehouses, storages, items and stock movements), then wrote the PHP logic for importing and exporting, then the screens on top.",
        decisions: [
            "Stock is calculated from the history of movements, not stored as one editable number, so every change leaves a trace.",
            "Database transactions wrap each import and export, so a failed step never leaves half-updated stock.",
        ],
        result: "Shipped. It manages multiple warehouses and storages, with stock levels updated by every import and export.",
        stack: ["PHP"],
        link: { label: "View on GitHub ↗", url: "https://github.com/MrAsemZ/WMS.git" },
    },
};
