# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - unreleased

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
