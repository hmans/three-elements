module.exports = {
  title: "three-elements",

  description:
    "Web Components-powered custom HTML elements for building Three.js-powered games and interactive experiences. 🎉",

  markdown: {
    externalLinks: {
      target: "",
      rel: ""
    }
  },

  head: [
    ["meta", { name: "theme-color", content: "#3eaf7c" }],
    ["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
    [
      "meta",
      { name: "apple-mobile-web-app-status-bar-style", content: "black" }
    ],
    [
      "script",
      {
        async: true,
        defer: "true",
        src: "https://plau.hmans.co/js/index.js",
        "data-domain": "three-elements.hmans.co"
      }
    ],

    [
      "script",
      { type: "module" },
      `import "https://cdn.skypack.dev/three-elements@next"`
    ]
  ],

  plugins: {
    "demo-container": { component: "CustomDemoBlock" }
  },

  themeConfig: {
    repo: "https://github.com/hmans/three-elements",
    editLinks: true,
    docsDir: "site/docs",
    docsBranch: "main",
    editLinkText: "Edit this page on GitHub",
    lastUpdated: false,
    displayAllHeaders: false,
    smoothScroll: true,

    algolia: {
      apiKey: "8bacebd83dc02de71183ea1364848bbc",
      indexName: "three-elements"
    },

    nav: [
      {
        text: "Guide",
        link: "/guide/"
      },
      {
        text: "API",
        link: "https://api.three-elements.hmans.co/"
      },
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
          "/guide/custom-cameras",
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
        children: [
          "/advanced/stacked-scenes",
          "/advanced/custom-renderers",
          "/advanced/optimized-rendering",
          "/advanced/reusing-resources",
          "/advanced/frameworks",
          "/advanced/webxr"
        ]
      },

      {
        type: "group",
        title: "Further Reading",
        collapsable: false,
        children: [["https://api.three-elements.hmans.co/", "API Reference"]]
      }
    ]
  }
}
