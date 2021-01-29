# Custom Cameras

## Setting the Active Camera

Every `<three-scene>` you create comes with a default camera out of the box that is exposed via the element's `.camera` property. You can either work with that instance, set the property to a new instance, or use the corresponding `camera` attribute on the tag to set the CSS selector that will be used to fetch the active camera:

:::demo

```html{2,5}
<three-game>
  <three-scene background-color="#eee" camera="#camera">
    <!-- This camera will replace the one that's automatically provided by the scene itself. -->
    <three-perspective-camera
      id="camera"
      position="5, 5, 50"
    ></three-perspective-camera>

    <!-- Lights on! -->
    <three-ambient-light intensity="0.2"></three-ambient-light>
    <three-directional-light
      intensity="0.8"
      position="10, 10, 50"
    ></three-directional-light>

    <three-mesh>
      <three-dodecahedron-buffer-geometry></three-dodecahedron-buffer-geometry>
      <three-mesh-standard-material color="red"></three-mesh-standard-material>
    </three-mesh>

    <three-orbit-controls></three-orbit-controls>
  </three-scene>
</three-game>
```

:::
