module.exports = {
  title: "three-elements",

  description:
    "Web Components-powered custom HTML elements for building Three.js-powered games and interactive experiences. 🎉",

  head: [
    ["meta", { name: "theme-color", content: "#3eaf7c" }],
    ["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
    [
      "meta",
      { name: "apple-mobile-web-app-status-bar-style", content: "black" }
    ],
    [
      "script",
      { type: "module" },
      `import "https://jspm.dev/three-elements@next"`
    ]
  ],

  plugins: { "demo-container": { component: "CustomDemoBlock" } },

  themeConfig: {
    repo: "https://github.com/hmans/three-elements",
    editLinks: false,
    docsDir: "",
    editLinkText: "Edit this page on GitHub",
    lastUpdated: false,
    displayAllHeaders: false,
    smoothScroll: true,

    nav: [
      {
        text: "Discord",
        link: "https://discord.gg/ybuUjFM"
      }
    ],

    sidebar: [
      {
        type: "group",
        title: "Guide",
        path: "/guide/",
        collapsable: false,
        children: [
          "/guide/",
          "/guide/getting-started",
          "/guide/the-basics",
          "/guide/ticker-events",
          "/guide/input-events",
          "/guide/lifecycle-events",
          "/guide/templates",
          "/guide/components"
        ]
      },

      {
        type: "group",
        title: "Advanced Guides",
        path: "/advanced/stacked-scenes",
        collapsable: false,
        children: ["/advanced/stacked-scenes", "/advanced/optimized-rendering"]
      }
    ]
  }
}
