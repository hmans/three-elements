# three-elements

You're looking at the humble beginnings of a documentation site for [three-elements](https://github.com/hmans/three-elements), a library providing Web Components Custom Elements for building Three.js applications.

Please bear with me while I fill in the blanks! In the meantime, here's a quick demo:

::: demo

```html
<three-game autorender>
  <three-scene background-color="#eee">
    <!-- Spinning dodecahedron -->
    <three-mesh
      scale="4"
      ontick="this.object.rotation.x = this.object.rotation.y += 0.01"
    >
      <three-dodecahedron-buffer-geometry></three-dodecahedron-buffer-geometry>
      <three-mesh-standard-material
        color="hotpink"
      ></three-mesh-standard-material>
    </three-mesh>

    <!-- Orbit controls, because they're cool! -->
    <three-orbit-controls></three-orbit-controls>

    <!-- Lights -->
    <three-ambient-light intensity="0.2"></three-ambient-light>
    <three-directional-light
      intensity="0.8"
      position="10, 40, 50"
      cast-shadow
    ></three-directional-light>
  </three-scene>
</three-game>
```

:::
