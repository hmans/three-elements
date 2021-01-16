# Ticker Events

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

In the example above, we rotate the mesh around its Z axis by an amount of 0.02 radians on every frame. This will work fine as long as the device that's running our application isn't skipping frames, but if it ever does, it will result in the animation being choppy.

A simple way to make animation code like the one above framerate-independent is to multiply animation values by the time passed since the last frame was rendered, often called "delta time".

The `<three-game>` element exposes a property called `deltaTime` that provides this value. Whenever you animate something, multiply things by this value, and your animations will perform independently from the actual framerate.

::: demo

```html{3}
<three-game autorender>
  <three-scene background-color="#eee">
    <three-mesh scale="5" ontick="this.object.rotateZ(2 * this.game.deltaTime)">
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

From within JavaScript code, you can also set the `ontick` and `onlatetick` properties on the element. This allows you to pass references to functions defined elsewhere. If you're building components using Lit-Element, you can use the `@tick` or `@latetick` syntax to assign these, too!

## Using Event Listeners

Finally, you can also directly subscribe to the emitted events by going through `element.addEventListener("tick", ...)`.

::: warning
For this to work, you also need to set the element's `ticking` property or attribute to `true`. If you directly assign `ontick` or `onlatetick`, this will be done for you.
:::

_TODO: Example here_
