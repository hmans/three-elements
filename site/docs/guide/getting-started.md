# Getting Started

## Prerequisites

- At least a basic understanding of the [Three.js API](https://threejs.org/docs/). Remember that three-elements is just a wafer-thin layer on top of it. Keep the [reference documentation](https://threejs.org/docs/) handy!
- The terrible burden of an imagination that knows no limits!

## Standalone (the modern way)

Modern browsers are awesome, they all speak JavaScript Modules now! This makes it almost too easy to consume NPM packages that use them straight from the confines of your browser:

```html
<script type="module">
  import "https://jspm.dev/three-elements"
</script>
```

This will import three-elements straight from [jspm](https://jspm.org/)'s wonderful CDN and automatically resolve whatever dependencies it may have, including Three.js itself.

## Standalone (the old-fashioned way)

If, for whatever reason, you want to go the old-fashioned UMD route, you can choose to import three-elements from [unpkg](https://unpkg.com/) (or similar). Here, you will have to make sure you're also importing Three.js itself, because unpkg will not resolve dependencies for you automatically:

```html
<script src="https://unpkg.com/three"></script>
<script src="https://unpkg.com/three-elements"></script>
```

::: warning
For the time being, three-elements will be bundling the UMD version required for this to work. It is possible that this UMD bundle will at some point be removed. It is **strongly** recommended to use the modern JavaScript Modules approach whenever you can.
:::

## Within an NPM/Yarn Project

If you prefer to run a build pipeline or have an existing project that you want to integrate three-elements in, just add the `three-elements` package to your build-time dependencies (and don't forget to also add `three` itself):

```sh
yarn add -D three-elements three
```

Or, with NPM:

```sh
npm install -D three-elements three
```

::: tip Heeeeyyyyy, you know...
Have you ever stopped to wonder why the documentation of pretty much every single package on NPM explains how to actually add the package to a project? I mean, seriously, shouldn't you know this at this point, and shouldn't it be enough to just give the official name of the package?

It's `three-elements`, by the way. Yeah.
:::
