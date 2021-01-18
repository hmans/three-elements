[![Version](https://img.shields.io/npm/v/three-elements)](https://www.npmjs.com/package/three-elements)
[![Version](https://img.shields.io/npm/v/three-elements/next?color=red)](https://www.npmjs.com/package/three-elements/v/next)
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

### **three-elements provides Web Components-powered custom HTML elements for building Three.js-powered games and interactive experiences.** 🎉

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
<three-game id="game" autorender>
  <three-scene background-color="#444">
    <!-- Lights on! -->
    <three-ambient-light intensity="0.2"></three-ambient-light>
    <three-directional-light intensity="0.8" position="10, 10, 50"></three-directional-light>

    <!-- Spinning dodecahedron! -->
    <three-mesh ontick="this.rotation.z += game.deltaTime">
      <three-dodecahedron-buffer-geometry></three-dodecahedron-buffer-geometry>
      <three-mesh-standard-material color="red"></three-mesh-standard-material>
    </three-mesh>
  </three-scene>
</three-game>
```

## DOCUMENTATION

- [Documentation](https://three-elements.hmans.co) & [Guide](https://three-elements.hmans.co/guide/)
- [Announcement blog post](https://hmans.co/posts/2021-01-18-three-elements/)

## COMMUNITY

- [Discord] for chat & help

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
[discord]: https://discord.gg/ybuUjFM
