# Input Events

If your application requires any kind of user interaction, three-elements aims at making this super-easy by exposing common input events (pointer movement/clicks, double-clicks et al) as normal DOM events emitted by the elements themselves.

### Example

::: demo

```html
<three-game autorender>
  <three-scene background-color="#222">
    <!-- Define a template. It automatically becomes available as a new HTML tag. -->
    <three-mesh
      scale="4"
      onpointerdown="this.object.rotateZ(0.4)"
      onpointerover="this.object.material.color.set('#fff'); this.object.scale.setScalar(1.2)"
      onpointerout="this.object.material.color.set('#666'); this.object.scale.setScalar(1)"
    >
      <three-dodecahedron-buffer-geometry></three-dodecahedron-buffer-geometry>
      <three-mesh-standard-material color="#666"></three-mesh-standard-material>
    </three-mesh>

    <three-orbit-controls></three-orbit-controls>

    <!-- Lights on! -->
    <three-ambient-light intensity="0.2"></three-ambient-light>
    <three-directional-light
      intensity="0.8"
      position="10, 10, 50"
    ></three-directional-light>
  </three-scene>
</three-game>
```

:::
