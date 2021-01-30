# Ticker Events

## What's a Ticker?!

No matter if you're just building a simple scene or a full game, at the core there will always be a loop that performs the following jobs over and over again:

1. Update application state (rotate meshes, update animations, fire guns, explode enemies, etc.)
2. Render a new frame.

This loop will run as often as possible (typically in sync with your monitor's refresh rate, eg. 60 times a second on a 60 Hz monitor), and as long as the application is running.

The `<three-game>` element implements a ticker that implements such a loop and offers convenient hooks that allow you to plug in your update logic, no matter how simple or complex.

::: tip
While big games designed for equally big GPUs can typically get away with rendering a new frame on every tick no matter what, on the Web it's often a good idea to be a little more conservative about this. three-elements provides a mechanism called [Optimized Rendering](/advanced/optimized-rendering) that will help you only render new frames when something has actually changed in your scene. Check it out!
:::

## Using `ontick` and `onlatetick`

The most important ticker events are `tick` and `latetick`. You may be wondering why we have two; this is merely a common game engine pattern where you would use `latetick` for any logic that needs a _guarantee_ that it runs after everything else. A typical situation where this is useful is when you have a camera that is following a character; you probably want to _always_ update the camera's position after updating the character's.

Every `<three-*>` element allows you to provide callbacks to these events via the attributes `ontick` and `onlatetick`. They look exactly like you're used to from the other DOM event handlers you're probably familiar with. Let's have an example!

::: demo

```html{3}
<three-game autorender>
  <three-scene background-color="#eee">
    <three-mesh scale="5" ontick="this.object.rotateZ(0.02)">
      <three-box-buffer-geometry></three-box-buffer-geometry>
      <three-mesh-basic-material color="red"></three-mesh-basic-material>
    </three-mesh>
  </three-scene>
</three-game>
```

:::

## Using deltaTime

In the example above, we rotate the mesh around its Z axis by an amount of 0.02 radians on every frame. This approach has two problems:

- The speed at which your animation plays entirely depends on the refresh rate of the device that runs it. On a 144 Hz monitor, your animation will play more than twice as fast as on a 60 Hz monitor.
- If that device ever misses frames, your animation will stutter, and/or slow down. If your game runs at a lousy 30 FPS because you overdid it with the postprocessing, your players will already be irate enough. Imagine how they'd feel if it also ran at half the speed!

A simple way to make animation and other state-updating code framerate-independent is to multiply values by the time passed since the last frame was rendered, often called "delta time". Instead of thinking "how much do I want to rotate this per frame", think "how much do I want to rotate it _per second_", and multiply that value by the delta time.

The `<three-game>` element exposes a property called `deltaTime` that provides this value:

::: demo

```html{3}
<three-game autorender>
  <three-scene background-color="#eee">
    <three-mesh scale="5" tick="object.rotateZ(2 * dt)">
      <three-box-buffer-geometry></three-box-buffer-geometry>
      <three-mesh-basic-material color="red"></three-mesh-basic-material>
    </three-mesh>
  </three-scene>
</three-game>
```

:::

::: tip
You will have noticed by now that, when setting ticker event handlers as string-based attributes, `this` will be bound to the element you're setting the attribute on. Since every element exposes a `game` property that provides a reference to the `<three-game>` element this object lives in, we can use that to conveniently access the `deltaTime`.

:::

## Setting Event Listeners via Properties

From within JavaScript code, you can also set the `ontick` and `onlatetick` properties on the element to point at a callback function. These functions will receive the delta time as well as a reference to the element itself as arguments. Example:

```js
const handleTick = (dt, { object, game }) => {
  object.rotation.x = object.rotation.y += 5 * dt
  game.requestFrame()
}

element.ontick = handleTick
```
