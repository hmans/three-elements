# Input Events

## Handling Pointer Events

If your application requires any kind of user interaction, three-elements aims at making this super-easy by exposing common input events (pointer movement/clicks, double-clicks et al) as normal DOM events emitted by the elements themselves.

Let's have an example with a mesh that reacts on the pointer entering, leaving, or clicking on it:

::: demo

```html
<three-game autorender>
  <three-scene background-color="#eee">
    <three-mesh
      scale="3"
      onpointerdown="this.object.rotateZ(0.4)"
      onpointerover="this.object.material.color.set('#fff'); this.object.scale.setScalar(4)"
      onpointerout="this.object.material.color.set('#666'); this.object.scale.setScalar(3)"
    >
      <three-dodecahedron-buffer-geometry></three-dodecahedron-buffer-geometry>
      <three-mesh-standard-material color="#666"></three-mesh-standard-material>
    </three-mesh>

    <three-ambient-light intensity="0.2"></three-ambient-light>
    <three-directional-light
      intensity="0.8"
      position="10, 10, 50"
    ></three-directional-light>
  </three-scene>
</three-game>
```

Remember, these are just plain old DOM events &ndash; just use them like you would do with any other HTML element.

:::

::: tip Wait, what? How does this work?

A typical approach to handling pointer events in a Three.js project is to retrieve the mouse position and then perform a raycast into the scene to see which object is hit. three-elements does this heavy lifting for you, finds the element that is home to the affected scene object, and makes it emit the corresponding DOM event. Voila!

:::

## List of Available Events

Currently implemented are `pointerdown`, `pointerup`, `pointermove`, `pointerenter`, `pointerleave`, `pointerout`, `click`, and `dblclick`.
