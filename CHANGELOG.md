# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2021-02-01

- **Breaking Change:** Ticker events have been completely reimplemented from scratch. The DOM events we were dispatching in an earlier version have been replaced by an internal event emitter, yielding significant (multliple orders of magnitude) performance gains. Because we are no longer using DOM events, the properties and attributes that allow you to hook callbacks into the ticker have been renamed to `tick`, `lateTick`, `frameTick` and `renderTick`, with their corresponding attributes now named `tick`, `late-tick`, `frame-tick` and `render-tick`.

  Ticker callback code that is passed via string attributes is run as the body of a function where `this` is the element itself, `object` is the object the element is managing, and `dt` is the current frame's delta time value:

  ```html
  <three-mesh tick="object.rotateZ(2 * dt)"></three-mesh>
  ```

  When directly assigning functions to these properties, they will now receive the delta time and a reference to the element itself as arguments. For example, in lit-html, you can now do this:

  ```js
  html`<three-mesh .tick=${(dt, { object }) => object.rotateZ(5 * dt)}></three-mesh>`
  ```

  Please [refer to the documentation](https://three-elements.hmans.co/guide/ticker-events.html) for details on how to use these!

- **New:** When assigning to an object property via an attribute, you can now set the attribute to a CSS selector to reference another object. This can, for example, be used to re-use geometries, materials and other potentially expensive resources:

  ```html
  <!-- Resources -->
  <three-box-buffer-geometry id="geometry"></three-box-buffer-geometry>
  <three-mesh-standard-material id="material" color="#555"></three-mesh-standard-material>

  <!-- Scene Contents -->
  <three-mesh position="-2, 0, 0" geometry="#geometry" material="#material"></three-mesh>
  <three-mesh position="0, 0, 0" geometry="#geometry" material="#material"></three-mesh>
  <three-mesh position="2, 0, 0" geometry="#geometry" material="#material"></three-mesh>
  ```

- **New:** When working with plain string attributes, you can now use the `deg` suffix to convert the specified value into radians. This is very useful in 100% HTML-based projects where you don't have access to JavaScript's `Math.PI`:

  ```html
  <three-mesh rotation.x="-90deg">...</three-mesh>
  ```

- **New:** You can now configure custom renderers! Just like with any other element provided by this library, you can use attributes to configure them to your needs:

  ```html
  <three-game>
    <three-web-gl-renderer xr.enabled></three-web-gl-renderer>
    <three-scene> ... </three-scene>
  </three-game>
  ```

  Renderers that are part of the THREE.\* namespace are supported out of the box; support for SVG and CSS renderers will come in a future update.

- **New:** You no longer have to use valid JSON syntax for `arg` attributes -- just provide a list of comma-separated values:

  ```html
  <three-fog args="#333333, 1, 1000"></three-fog>
  ```

  The commas, in fact, are now purely optional. This will also work:

  ```html
  <three-fog args="#333333 1 1000"></three-fog>
  ```

- **New:** `<three-game>` now dispatches a `ready` event you can hook your game's initialization code into.

- **New:** We now publish a full [API Reference](https://api.three-elements.hmans.co/). Enjoy!

- **Changed:** By popular request, three-elements will no longer log to the console on startup. Enjoy the quiet!

- **Changed:** The core ticker loop now makes use of `setAnimationLoop` instead of `requestAnimationFrame`, which is a critical prerequisite for making your three-elements project [WebXR-ready](https://three-elements.hmans.co/advanced/webxr.html).

- **Changed:** When attributes on an element map to a non-existing property on the wrapped object, there will no longer be a warning logged to the console. (This is very useful when you're combining three-elements with other frameworks that make use of their own attribute names on your elements.)

- **Fixed:** When assigning attributes a value of "0", this will now correctly assign the parsed numerical value of 0 to the corresponding property, not a string representation of it. Programming, how does it work?

- **Fixed:** Orthographic cameras now have their frustums and projection matrices updated when the viewport is resized.

- **Fixed:** When using the `attach` attribute, a valid candidate element to attach to is now searched for across the boundaries of Shadow DOMs. If this sentence makes any sense to you, I bow to you, for we are united in this madness.

- **Fixed:** Many little odds and ends, especially with regard to framework interoperability.

### Internals

If you've been extending ThreeElement in your own code, or hacking on the codebase itself, please note the following changes:

- **New:** All element logic that does not deal with managing a wrapped Three.js object has been moved to a new base class called `BaseElement` that `ThreeElement` now extends. `BaseElement` performs lifecycle management, ticker event handling and other base functionality.

- **Breaking Change:** `readyCallback` was renamed to `mountedCallback` to better reflect when this callback is invoked.

- **New:** The `BaseElement` class now also provides a `removedCallback` method that will be invoked when we know the element is being _removed_ from the DOM entirely, not just _moved_ to a new parent (as is often the case when pairing three-element with a web application framework.)

- **Changed:** Instead of using a MutationObserver instance to monitor the element for updated attributes (we can't feasibly make use of `observedAttributes`, remember?), we now simply hook into `setAttribute` to react on attribute changes. This yields _significant_ (order of a magnitude) performance improvements in projects that go through element attributes a lot. Sadly, it also means that changes you're making to the DOM in your browser's dev tools will no longer be picked up automatically (but this feature may make a comeback at a later date.)

- **Changed:** `yarn dev` now makes use of the excellent [@web/dev-server](https://modern-web.dev/docs/dev-server/overview/). This allows us to get rid of the importmap shim we had been using so far, load additional dependencies straight from our own `node_modules`, and greatly increase iteration speed during development.

- **Holy Crap:** `applyProps` was refactored to use `if` instead of `switch (true)`. All you Senior JavaScript Architects can finally calm down, for I am no longer impeding upon your creed!

## [0.2.1] - 2021-01-27

- **Fixed:** Compatibility with recently released [Three.js r125](https://github.com/mrdoob/three.js/releases/tag/r125)!

## [0.2.0] - 2021-01-18

- **New:** Elements now emit `connected`, `ready` and `disconnected` lifecycle events that bubble up the DOM tree.

- **New:** Elements now expose the `requestFrame` function directly, making it a bit more convenient to request a new frame to be rendered (you no longer have to find the game object.)

- **Breaking Change:** 💥 Completely revamped the ticker system to make it easier to use, and make three-elements more straight-forward to integrate with web application frameworks:

  - Ticker callbacks have been renamed from `onupdate`, `onlateupdate`, `onframe` and `onrender` to `ontick`, `onlatetick`, `onframetick` and `onrendertick`.
  - Ticker events now are normal CustomEvents, meaning that you would implement callbacks like any other DOM event callback, eg. either as an attribute, `ontick="console.log('sup')"`, or directly setting the property to an event listener function.
  - You can also directly subscribe to these events through `element.addEventListener`, but in this case you may need to explicitly set the element's `ticking` attribute/property to true in order for it to actually connect to the game's ticker.
  - Ticker events have an `event.detail.deltaTime` property that contains the current frame's delta time.
  - The `<three-game>` element now also exposes a property named `deltaTime` that contains the current frame's delta time.

- **Breaking Change:** When setting DOM event handlers through attributes (eg. `onclick="..."`), these will no longer automatically run `requestFrame` for you.

- **Breaking Change:** Nested properties can now be set using a period separator syntax. Example: the `position.x` attribute will now map to `position.x`. A colon separator (`position:x`) is also supported in case a framework is giving you trouble. The previous dashy syntax will now map attributes to their camel-cased counterparts (eg. `receive-shadow` will set `receiveShadow`.)

- **Breaking Change:** When directly assigning a function to the `ontick`, `onlatetick` etc. properties, we no longer move heaven and earth to bind that function to the element's scope, which vastly improves interoperability with frontend frameworks that let you set properties directly.

- **Changed:** You can now set a Three object's mixed-case properties through attributes of the same name, but dasherized. Example: The `cast-shadow` attribute will set the `castShadow` property.

- **Fixed:** `<three-gltf-asset>` no longer loads the same GLTF twice.
- **Fixed:** `<three-gltf-asset>` now creates local clones of the loaded GLTF scene (so you can place multiple copies of the same GLTF into your scene.)
- **Fixed:** `<three-gltf-asset>` now properly forwards `create-shadow` and `receive-shadow` attributes to the GLTF scene.

## [0.1.3] - 2021-01-13

- **Fixed:** compatibility with frameworks that set `ontick` & friends directly as properties (eg. Svelte)

## [0.1.2] - 2021-01-13

- **Fixed:** All of the built-in elements now check if they're already defined before attempting to define themselves again. This is useful for development environments with hot reload or HMR, where they would otherwise raise an error about tags already having been defined.

## [0.1.1] - 2021-01-12

- **Changed:** The `<three-game>` element now has width: 100%, height: 100% and display: block applied to it by default. If you just plug it into the `<body>`, it will use the full display area; if it has a parent element, it will automatically expand its size to fill that. You can, however, also directly style the `three-game` element. The web is a beautiful place!

## [0.1.0] - 2021-01-12

- First release. Let's do this!
