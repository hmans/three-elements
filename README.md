[![Version](https://img.shields.io/npm/v/three-elements)](https://www.npmjs.com/package/three-elements)
[![CI](https://github.com/hmans/three-elements/workflows/CI/badge.svg)](https://github.com/hmans/three-elements/actions?query=workflow%3ACI)
[![Downloads](https://img.shields.io/npm/dt/three-elements.svg)](https://www.npmjs.com/package/three-elements)
[![Bundle Size](https://img.shields.io/bundlephobia/min/three-elements?label=bundle%20size)](https://bundlephobia.com/result?p=three-elements)
[![Discord](https://img.shields.io/discord/766340976125542430?color=hotpink&label=discord)](https://discord.gg/ybuUjFM)

```
 __   __    🗻     🗻   ⛰
|  |_|  |--.----.-----.-----.          🦅                                      🌞
|   _|     |   _|  -__|  -__|
|____|__|__|__| |_____|_____|  🗻  🌲🌳      __  🌲  🌳                🦅
    .-----.|  |.-----.--------.-----.-----.|  |_.-----.
    |  -__||  ||  -__|        |  -__|     ||   _|__ --|
    |_____||__||_____|__|__|__|_____|__|__||____|_____|   🌳🌲 🏡 🌲   🌲🌳  🐄   🌲 🌲🌳     🌳
```

### **three-elements is a set of Web Components-powered custom HTML elements for building Three.js-powered games and interactive experiences.** 🎉

> **WARNING:** It is early days for this library, so pleace proceed with caution!

- Directly exposes all [Three.js] classes as **HTML elements** (eg. `<three-mesh>` for `THREE.Mesh`!)
- **Elements are fully reactive**; if their attributes change, this is immediately reflected in the Three.js scene.
- **Optimized rendering:** Frames are only rendered when something has changed in the scene, or if your code explicitly requests it.
- **Input event handling:** Your 3D scene automatically handles pointer events (clicks, hover, etc). Just hook into the same HTML DOM events you would use in any other web application (`onclick` et al.)
- Use it with **any framework** that emits or modifies HTML DOM, or **no framework** at all!
- Works with **any version of Three.js**, including your own fork if you have one.
- Built-in templating support lets you reuse objects or entire scenes across your project without the need for any JavaScript component framework.

```html
<!-- Create a Three.js game with a default camera. -->
<three-game>
  <three-scene background-color="#444">
    <!-- Lights on! -->
    <three-ambient-light intensity="0.2"></three-ambient-light>
    <three-directional-light intensity="0.8" position="10, 10, 50"></three-directional-light>

    <!-- Spinning dodecahedron! -->
    <three-mesh onupdate="dt => this.rotation.z += dt">
      <three-dodecahedron-buffer-geometry></three-dodecahedron-buffer-geometry>
      <three-mesh-standard-material color="red"></three-mesh-standard-material>
    </three-mesh>
  </three-scene>
</three-game>
```

## EXAMPLES

three-elements can be used on its own, but it can also be used together with a framework. Any framework will work that emits to or modifies the HTML DOM, so there's plenty of options! Here's a couple of examples:

- [three-elements with static HTML](https://codesandbox.io/s/three-elements-static-7orc4)
  - **It Just Works.** It's just HTML! HTML is awesome!
- [three-elements with Svelte](https://codesandbox.io/s/three-elements-svelte-dx1gv?file=/App.svelte)
  - **It Just Works.** Svelte works extremely close to the DOM, so there are no surprises here.
- [three-elements with Vue](https://codesandbox.io/s/three-elements-vue-1swry?file=/src/App.vue)
  - **Caveat:** Vue requires [some minor configuration](https://v3.vuejs.org/guide/migration/custom-elements-interop.html#autonomous-custom-elements) to stop it from spitting out warnings about `<three-*>` tags.
- [three-elements with React](https://codesandbox.io/s/three-elements-react-9nqh4?file=/src/App.js)
  - **Caveat:** you can't currently directly assign function callbacks to `onupdate` and friends. Improvements to this are being [discussed in the React community](https://github.com/facebook/react/issues/11347), also see [this page on custom-elements-everywhere.com](https://custom-elements-everywhere.com/libraries/react/results/results.html). You can work around this caveat by directly setting the `onupdate` etc. properties on element refs.
- [three-elements with HyperApp](https://codesandbox.io/s/three-elements-hyperapp-rxhei?file=/index.html)
  - **Caveat:** HyperApp currently refuses to emit `onupdate` and related attributes. ([Issue](https://github.com/jorgebucaran/hyperapp/issues/1010))

## BASIC USAGE

### First things first

**three-elements** provides a declarative layer over [Three.js] based on [custom elements], allowing you to build Three.js-powered 3D scenes and applications just using HTML tags. It provides direct access to Three.js' entire API, and doesn't need a build pipeline or JavaScript framework (but can easily be integrated with them when needed.) Classes provided by Three.js are automatically made available as HTML tags of the same name; for example, `THREE.MeshStandardMaterial` becomes available as `<three-mesh-standard-material>`, and so on. If a new release of Three.js has a new feature, you can automatically use it via three-elements.

Attributes that you set on the element will be applied to the wrapped Three.js object, with the special argument `args` being passed to its constructor. Elements are reactive, so if any of the attributes change, they will be immediately applied to the wrapped object, with only a handful of exceptions.

You can use three-elements to build animated scenes on static, standalone HTML pages, build full 3D applications or games by combining it with whatever JavaScript framework you prefer, or just apply a thin veneer of hand-crafted, framework-less JavaScript. It's all up to you. But let's start at the beginning.

### Adding three-elements in your project

If your project has a build pipeline, just add the NPM package to your package.json like you're used to:

```
npm add -D three-elements
yarn add -D three-elements
```

If you'd rather work without a build pipeline, just add the following tag to your HTML:

```html
<script type="module">
  import "https://jspm.dev/three-elements"
</script>
```

This will make use of the modern JavaScript module support that is now available in pretty much all relevant browsers.

### Setting up game and scene

The root element of any three-elements project is `<three-game>`. It must contain at least one `<three-scene>` element, which will then contain the actual scene objects.

```html
<three-game>
  <three-scene>
    <!-- scene contents here -->
  </three-scene>
</three-game>
```

### Adding stuff to scene

Now you can add anything to the scene that you would typically add to a plain Three.js project's scene, except instead of adding things imperatively, you merely describe them using HTML tags. Let's have a simple mesh with a THREE.BoxGeometry and a THREE.MeshNormalMaterial:

```html
<three-game>
  <three-scene>
    <three-mesh scale="4">
      <three-box-geometry></three-box-geometry>
      <three-mesh-normal-material></three-mesh-normal-material>
    </three-mesh>
  </three-scene>
</three-game>
```

Now for a little fun experiment: open your browser's devtools, inspect your DOM, and change the value of the `scale` attribute -- you will see the change immediately reflected in your 3D scene. Reactivity at work!

### Ticker events

`<three-game>` implements a frame-based ticker that emits a series of events. three-elements provides a convenient way to hook into these events via attributes:

```html
<three-game>
  <three-scene>
    <three-mesh onupdate="console.log">
      <three-box-geometry></three-box-geometry>
      <three-mesh-normal-material></three-mesh-normal-material>
    </three-mesh>
  </three-scene>
</three-game>
```

`onupdate` is expected to return a function that takes a single argument -- more on that below. In this small example, we will simply log it to the browser console. Let's do something a little more involved:

```html
<three-game>
  <three-scene>
    <three-mesh
      onupdate="dt => this.setAttribute('rotation-z', parseFloat(this.getAttribute('rotation-z')) + 3 * dt)"
    >
      <three-box-geometry></three-box-geometry>
      <three-mesh-normal-material></three-mesh-normal-material>
    </three-mesh>
  </three-scene>
</three-game>
```

The argument passed into the callback function -- `dt` -- is a delta time value that represents the fraction of a second that has passed since the last frame was rendered, which will help you make animations smooth and frame-independent. Also note that `this` is bound to the HTML element itself; it exposes an `object` property that references the actual Three.js scene object represented by it. We're using this here to update the element's `rotate-z` attribute on every tick.

**NOTE:** While this provides a convenient way to mutate your 3D scene, you will, in most cases, not work with DOM attributes, but rather with the underlying Three.js objects directly. For example:

```html
<three-game autorender>
  <three-scene>
    <three-mesh onupdate="dt => this.object.rotation.z += 3 * dt">
      <three-box-geometry></three-box-geometry>
      <three-mesh-normal-material></three-mesh-normal-material>
    </three-mesh>
  </three-scene>
</three-game>
```

We're modifying the Mesh object directly here. Note that `<three-game>` will only _automatically_ render new frames when something in the DOM changed, and since we're no longer modifying the DOM here, we need to request new frames explicitly. Because we don't want to deal with this complexity quite yet, we instead set the `autorender` attribute on `<three-game>`, which allows you to completely opt-out of the optimized rendering logic. (But please consider this a last resort. It's a cool feature!)

### Pointer events

_TODO_

### Templates

_TODO_

## ADVANCED USAGE

_EXTREMELY TODO_

No, seriously! I'm working on a separate tutorial site that will have live examples and go into the more advanced topics. Stay tuned. In the meantime, if you're stuck, please drop by [on our Discord](https://discord.gg/ybuUjFM).

## CONTRIBUTING

**Please get in touch _before_ submitting Pull Requests** (ideally, _before_ even implementing them.) At this stage in its development, three-elements still is heavily in flux. If there is something you would like to contribute, please open an issue and describe your suggestion.

If you want to do some hacking, just run `yarn dev`, which will compile the package in watch mode and spawn a server on `localhost:5000` that serves the contents of the `examples/` directory.

## THANKS

- [Three.js] for being _the_ 3D library for the web.
- [A-Frame] for introducing Web Components-powered easy to use 3D and VR.
- [react-three-fiber] for its smart approach of mirroring `THREE.*` classes 1:1 instead of building a library of custom components.

[react-three-fiber]: https://github.com/pmndrs/react-three-fiber
[trinity]: https://github.com/hmans/trinity
[a-frame]: https://aframe.io/
[three.js]: https://threejs.org/
[custom elements]: https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements
