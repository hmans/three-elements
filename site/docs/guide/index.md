# Introduction

## What is three-elements?

three-elements is a small library that provides a **Web Components layer** for declaratively building **Three.js applications**.

If you're familiar with both Web Components and Three.js, that may be all you need to know, so feel free to jump straight to the [Getting Started](./getting-started.html) section. If not, keep reading!

## What does Three.js look like?

[Three.js](https://threejs.org/), which is three-elements' only dependency, is a JavaScript library providing a slightly higher-level API over WebGL. It is one of the most popular libraries used by web-based 3D applications, experiences, and games.

It exposes an imperative JavaScript API that looks like this:

```js
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const geometry = new THREE.BoxBufferGeometry()
const material = new THREE.MeshBasicMaterial({
  color: 0x00ff00
})
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

camera.position.z = 5

const animate = function() {
  requestAnimationFrame(animate)

  cube.rotation.x += 0.01
  cube.rotation.y += 0.01

  renderer.render(scene, camera)
}

animate()
```

::: tip "Imperative", "declarative"?!
This documentation will mention these terms a lot, so if you're confused, here's a quick explainer. In the context of programming, "imperative" refers to code that executes a series of commands ("do this!"), while "declarative" describes code that describes an intended result ("this is what I want!").

Both approaches have advantages and disadvantages. The main advantage of three-elements doing things declaratively is that you can easily pair it with any of the _countless_ declarative web application frameworks out there, like React, Vue, or Svelte.

three-elements' primary job is to translate your declarative code into the imperative commands that Three.js understands. Yay!
:::

## What does three-elements add?

three-elements wraps Three.js and provides a set of custom HTML elements (Web Components) that allow you to declaratively construct Three.js applications. If this sentence sounds confusing, here's a simpler way to put it:

**three-elements lets you build Three.js applications using HTML tags.** 🤯

The same application from above, when built using three-elements, looks like this:

```html
<three-game autorender>
  <three-scene>
    <three-mesh ontick="this.object.rotation.x = this.object.rotation.y += 0.1">
      <three-box-buffer-geometry></three-box-buffer-geometry>
      <three-mesh-basic-material color="#00ff00"></three-mesh-basic-material>
    </three-mesh>
  </three-scene>
</three-game>
```

three-elements provides a HTML tag for every class exported by Three.js. For example, for `THREE.MeshBasicMaterial`, there is `<three-mesh-basic-material>`; for `THREE.DirectionalLight`, there's `<three-directional-light>`; and so on.

These elements fully take care of the lifecycle of their wrapped objects, automatically adding them to or removing them from the scene, and cleanly disposing of them where necessary.

Attributes are linked to the wrapped object's properties of the same name. They're also fully reactive, so every time they change, this change is also set on the wrapped object.

```html
<!-- Sets the color property on the wrapped MeshStandardMaterial instance. -->
<three-mesh-standard-material color="green"></three-mesh-standard-material>
```

You can use three-elements to build 3D applications using **static HTML** (like we've been doing in the examples), or **pair it with any web application framework** that interacts with the DOM.

On top of all this, three-elements provides a thin bit of scaffolding to reduce boilerplate in your own code. Most importantly:

- A built-in [**ticker**](./ticker-events) that lets you hook into various stages of each frame.
- **Full [**pointer events**](./input-events) support;** just set `onclick`, `onpointerover` & friends on your `<three-*>` elements like you're used to from normal, non-3D web application development.
- Support for [**stacked scenes**](/advanced/stacked-scenes/), making the implementation of HUDs or cockpit views trivial.
- [**Optimized rendering**](/advanced/optimized-rendering/) where no new frames will be rendered if there hasn't been a change in the scene.

But let's start at [the beginning](./getting-started.html), shall we?
