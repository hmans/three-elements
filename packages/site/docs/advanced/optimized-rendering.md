# Optimized Rendering

### What is Optimized Rendering?

While games and other 3D applications can typically get away with rendering as many frames as possible when they're running on powerful devices with dedicated GPUs, applications built for the web quite often run on much less powerful decices &ndash; and brute-force rendering like that is a surefire way to quickly spin up their fans, drain their batteries, and frustrate their users.

It's good to be a bit smarter about this, and three-elements helps you with this through a feature called "Optimized Rendering".

Optimized Rendering is **enabled by default** and basically makes sure that new frames are only rendered **when they have been requested**.

For this, each element provided by three-elements provides a `requestFrame` function that can be called to tell the game loop that a frame should be rendered on this tick. Typically, you will want to call when you've changed something in the scene. For example, let's say you have a mesh with an `onclick` handler:

```html
<three-mesh
  onclick="this.object.rotateZ(0.4); this.requestFrame()"
></three-mesh>
```

If you were to omit the call to `requestFrame`, the object would still be updated when the user clicks on it, but this change would not be rendered.

`requestFrame` will also automatically be called for you when one of the attributes of an element has changed (as opposed to a Three.js object property having been mutated), assuming that this is an external change coming from your framework, and not the element's ticking or input handling code.

::: tip
Calls to `requestFrame` are idempotent; they don't immediately render a frame, but just tell the main loop that it should render one once it has finished executing all ticker callbacks. You can call it as many times as you want, and it will only ever result in a single frame being rendered.
:::

### The `frame-tick` ticker event

You've already met `tick` and `late-tick`, but there's a third ticker event called `frame-tick`! It works just like the other events, with one important difference: it is **only executed on ticks where a frame has been requested to render**. This is useful for code that you only want to execute when you're rendering a new frame anyway; for example, you may only want to move the game's camera when the player character has also moved (triggering a call to `requestFrame`.)

::: tip
Just like with the other ticker events, you can configure callbacks through either the `frame-tick` attribute or the `frameTick` property.
:::

### Disabling Optimized Rendering

Sometimes you may not care about Optimized Rendering, so three-element makes it easy to opt out of it. Simply set the `autorender` attribute on the `<three-game>` tag, like this:

```html
<three-game autorender></three-game>
```

Your game will now render a new frame on every tick, and ignore all calles to `requestFrame`.
