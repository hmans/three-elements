# Getting Started

## Prerequisites

- At least a basic understanding of the [Three.js API](https://threejs.org/docs/). Remember that three-elements is just a wafer-thin layer on top of it. Keep the [reference documentation](https://threejs.org/docs/) handy!
- Your favorite browser and code editor, as well as the terrible burden of an imagination that knows no limits! (But mostly the browser and the editor.)

## Standalone (the modern way)

Modern browsers are awesome, they all speak JavaScript Modules now! This makes it almost too easy to consume modern NPM packages straight from the confines of your browser:

```html
<script type="module">
  import "https://cdn.skypack.dev/three-elements"
</script>
```

This will import three-elements straight from [Skypack](https://www.skypack.dev/)'s wonderful CDN and automatically resolve whatever dependencies it may have, including Three.js itself. (You can also use any other NPM hosting service that automatically resolves and imports dependencies.)

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

Now just import the library somewhere in your code:

```js
import "three-elements"
```

::: tip
The `three-elements` package provides some [optional exports](https://api.three-elements.hmans.co/modules.html). If you don't need any of them, please still import the library like shown above &ndash; if you don't, it will never have a chance to register its custom elements.
:::
