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

## Using `tick` and `late-tick`

The most important ticker events are `tick` and `late-tick`. You may be wondering why we have two; this is merely a common game engine pattern where you would use `late-tick` for any logic that needs a _guarantee_ that it runs after everything else. A typical situation where this is useful is when you have a camera that is following a character; you probably want to _always_ update the camera's position after updating the character's.

Every `<three-*>` element allows you to provide callbacks to these events via the attributes `tick` and `late-tick`. They look exactly like you're used to from the other DOM event handlers you're probably familiar with. Let's have an example!

::: demo

```html{3}
<three-game autorender>
  <three-scene background-color="#eee">
    <three-mesh scale="5" tick="object.rotateZ(0.02)">
      <three-box-buffer-geometry></three-box-buffer-geometry>
      <three-mesh-basic-material color="red"></three-mesh-basic-material>
    </three-mesh>
  </three-scene>
</three-game>
```

:::

Code passed to these arguments is then executed on ever tick (or late tick). The function this code runs in is bound to the element owning the attribute, so you have `this` available as a reference to the element itself, and `object` as a reference to the Three.js object managed by the element.

::: tip
Of course you can also set these callbacks by assigning JavaScript functions to element properties; the properties you want to set are called `tick` and `lateTick`. For more details on using three-elements through JavaScript, please check out the [Frameworks](/advanced/frameworks) guide.
:::

## Using deltaTime

In the example above, we rotate the mesh around its Z axis by an amount of 0.02 radians on every frame. This approach has two problems:

- The speed at which your animation plays entirely depends on the refresh rate of the device that runs it. On a 144 Hz monitor, your animation will play more than twice as fast as on a 60 Hz monitor.
- If that device ever misses frames, your animation will stutter, and/or slow down. If your game runs at a lousy 30 FPS because you overdid it with the postprocessing, your players will already be irate enough. Imagine how they'd feel if it also ran at half the speed!

You will typically want to make these things **framerate-independent**, and a popular way of doing this is to multiply all animation values by the time passed since the last frame was rendered &ndash; often called "delta time". Instead of thinking "how much do I want to rotate this per frame", think "how much do I want to rotate it _per second_", and multiply that value by the delta time.

The current frame's delta time is made available in these callback functions as the `dt` variable:

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

## Setting Event Listeners via Properties

From within JavaScript code, you can also set the `tick` and `lateTick` properties on the element to point at a callback function. These functions will receive the delta time as well as a reference to the element itself as arguments. Example:

```js
const handleTick = (dt, { object, requestFrame }) => {
  object.rotation.x = object.rotation.y += 5 * dt
  requestFrame()
}

element.tick = handleTick
```
