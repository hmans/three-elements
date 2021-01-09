[![Version](https://img.shields.io/npm/v/three-elements)](https://www.npmjs.com/package/three-elements)
[![CI](https://github.com/hmans/three-elements/workflows/CI/badge.svg)](https://github.com/hmans/three-elements/actions?query=workflow%3ACI)
[![Downloads](https://img.shields.io/npm/dt/three-elements.svg)](https://www.npmjs.com/package/three-elements)
[![Bundle Size](https://img.shields.io/bundlephobia/min/three-elements?label=bundle%20size)](https://bundlephobia.com/result?p=three-elements)

```
 __   __
|  |_|  |--.----.-----.-----.                                                   🌞
|   _|     |   _|  -__|  -__|                              🦅
|____|__|__|__| |_____|_____|           __                       🦅
.-----.|  |.-----.--------.-----.-----.|  |_.-----.
|  -__||  ||  -__|        |  -__|     ||   _|__ --|
|_____||__||_____|__|__|__|_____|__|__||____|_____|   🌳🌲 🏡 🌲   🌲🌳  🐄   🌲 🌲🌳     🌳
```

## WORK IN PROGRESS ☢️

This library currently is extremely, heavily, absurdly **WORK IN PROGRESS**. Take a look at the examples listed below if you're curious, feel free to experiment around with it a bunch, but I would currently advise against actually using it in any real project. I'm still dialing in the API, things will be very much in flux for some time, the entire thing may change completely from one patch version to the next. Aaaaah!

## WEB COMPONENTS-POWERED THREE.JS

**three-elements is a set of Web Components-powered custom HTML elements for building Three.js-powered games and interactive experiences.** Instead of providing custom-built higher-level components (like many other libraries in this space), three-elements directly exposes all Three.js classes through automatically generated custom HTML elements, no matter which version of Three.js you're using.

**Elements are fully reactive**; if their attributes change, this is immediately reflected in the Three.js scene.

three-elements can be used standalone in **static HTML**, or together with the HTML **application framework** of your choice.

```html
<!-- Create a Three.js game with a default camera. -->
<three-game>
  <!-- Lights on! -->
  <three-ambient-light intensity="0.2"></three-ambient-light>
  <three-directional-light intensity="0.8" position="10, 10, 50"></three-directional-light>

  <!-- Spinning dodecahedron! -->
  <three-mesh onupdate="dt => this.rotation.z += dt">
    <three-dodecahedron-buffer-geometry></three-dodecahedron-buffer-geometry>
    <three-mesh-standard-material color="red"></three-mesh-standard-material>
  </three-mesh>
</three-game>
```

## EXAMPLES

three-elements can be used on its own, but it's best when coupled with some sort of framework. You can use it with any framework or technology that emits a HTML DOM, so there's plenty of options! Here's a couple of examples:

- [three-elements with static HTML](https://codesandbox.io/s/three-elements-static-7orc4)
  - **It Just Works.** Note how you can plug simple update functions directly into the `onupdate` attribute of any object.
- [three-elements with Svelte](https://codesandbox.io/s/three-elements-svelte-dx1gv?file=/App.svelte)
  - **It Just Works.** Svelte works extremely close to the DOM, so there are no surprises here.
- [three-elements with Vue](https://codesandbox.io/s/three-elements-vue-1swry?file=/src/App.vue)
  - **Caveat:** Vue really doesn't like custom elements much, requiring you to register them before emitting. We can eventually fix this three-elements with a bit of glue code.
- [three-elements with React](https://codesandbox.io/s/three-elements-react-9nqh4?file=/src/App.js)
  - **Caveat:** you can't currently directly assign function callbacks to `onupdate` and friends. Improvements to this are being [discussed in the React community](https://github.com/facebook/react/issues/11347), also see [this page on custom-elements-everywhere.com](https://custom-elements-everywhere.com/libraries/react/results/results.html). You can work around this caveat through refs, but if you really want to React, maybe consider using [react-three-fiber] instead.
- [three-elements with HyperApp](https://codesandbox.io/s/three-elements-hyperapp-rxhei?file=/index.html)
  - **Caveat:** apparently you can't currently assign `onupdate` attributes as they get swallowed by the framework for some reason. I'm not very familiar with HyperApp and will investigate and hopefully fix this eventually.

[react-three-fiber]: https://github.com/pmndrs/react-three-fiber
