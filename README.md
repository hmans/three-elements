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

## WEB COMPONENTS-POWERED THREE.JS

> **WIP WARNING:** This library currently is extremely, heavily, absurdly **WORK IN PROGRESS**. Take a look at the examples listed below if you're curious, feel free to experiment around with it a bunch, but I would currently advise against actually using it in any real project. I'm still dialing in the API, things will be very much in flux for some time, the entire thing may change completely from one patch version to the next. Aaaaah! ☢️

### **three-elements is a set of Web Components-powered custom HTML elements for building Three.js-powered games and interactive experiences.**

- Directly exposes all [Three.js] classes as **HTML elements**.
  **Elements are fully reactive**; if their attributes change, this is immediately reflected in the Three.js scene.
- Works with **any version of Three.js**, including your own fork if you have one.
- Use it with **any framework** that emits HTML, or **no framework** at all!
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

three-elements can be used on its own, but it's best when coupled with some sort of framework. You can use it with any framework or technology that emits a HTML DOM, so there's plenty of options! Here's a couple of examples:

- [three-elements with static HTML](https://codesandbox.io/s/three-elements-static-7orc4)
  - **It Just Works.** Note how you can plug simple update functions directly into the `onupdate` attribute of any object.
- [three-elements with Svelte](https://codesandbox.io/s/three-elements-svelte-dx1gv?file=/App.svelte)
  - **It Just Works.** Svelte works extremely close to the DOM, so there are no surprises here.
- [three-elements with Vue](https://codesandbox.io/s/three-elements-vue-1swry?file=/src/App.vue)
  - **Caveat:** Vue requires [some minor configuration](https://v3.vuejs.org/guide/migration/custom-elements-interop.html#autonomous-custom-elements) to stop it from spitting out warnings about `<three-*>` tags.
- [three-elements with React](https://codesandbox.io/s/three-elements-react-9nqh4?file=/src/App.js)
  - **Caveat:** you can't currently directly assign function callbacks to `onupdate` and friends. Improvements to this are being [discussed in the React community](https://github.com/facebook/react/issues/11347), also see [this page on custom-elements-everywhere.com](https://custom-elements-everywhere.com/libraries/react/results/results.html). You can work around this caveat by directly setting the `onupdate` etc. properties on element refs.
- [three-elements with HyperApp](https://codesandbox.io/s/three-elements-hyperapp-rxhei?file=/index.html)
  - **Caveat:** apparently you can't currently assign `onupdate` attributes as they get swallowed by the framework for some reason. I'm not very familiar with HyperApp and will investigate and hopefully fix this eventually.

## TODO

It's early days for three-elements, but development is moving fast. Here's a list of some stuff that I am and will be working on:

- [x] Basic functionality (registration of `<three-*>` elements)
- [x] Compatibility with browser modules
- [x] Templating (`<three-template>`)
- [x] A charming API for creating logic components without the need for any extra frameworks.
- [ ] Documentation! Specifically:
  - [ ] A better README! :-)
  - [ ] A separate step-by-step guide
  - [ ] Some notes on how three-elements compares to [A-Frame], [react-three-fiber], and others
- [ ] Implement some more of the game-specific primitives from [trinity], this library's precursor. Some of these may end up in a separate library, since people may want to solve these in a different fashion from how I do it. These include:
  - [x] Optimized rendering (only render new frames when something has changed)
  - [x] Primitives for easier handling of OrbitControls & friends, and registering the default camera for the current scene
  - [x] Pointer events
  - [x] Stacked scenes
  - [x] Resource loading (GLTF, FBX et al)
- [ ] Figure out automated testing. Hooooboi, this one's going to be interesting! (#8)
- [ ] Figure out if it's in any way possible to provide typings for `<three-*>` tags for popular editors
- [ ] Figure out a cool way to bring low-friction animation into the mix
- [ ] Experiment with variable bindings (but maybe we should leave that to the frameworks?)

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
