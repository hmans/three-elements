---
home: true
heroText: three-elements
heroImage: /three-elements-logo.jpg
tagline: Web Components for Three.js! 🎉
actionText: Read the Guide →
actionLink: /guide/
footer: MIT Licensed | Copyright © 2021-present Hendrik Mans
---

::: demo

```html
<three-game autorender>
  <three-scene background-color="#eee">
    <!-- Spinning dodecahedron -->
    <three-mesh
      scale="4"
      cast-shadow
      tick="this.object.rotation.x = this.object.rotation.y += 0.01; this.object.scale.setScalar(4 + Math.cos(Date.now() / 700) * 0.6)"
    >
      <three-dodecahedron-buffer-geometry></three-dodecahedron-buffer-geometry>
      <three-mesh-standard-material
        color="hotpink"
      ></three-mesh-standard-material>
    </three-mesh>

    <!-- A floor. We like shadows. Shadows good! -->
    <three-mesh rotation.x="-90deg" position.y="-7" receive-shadow>
      <three-plane-buffer-geometry
        args="1000, 1000, 32"
      ></three-plane-buffer-geometry>
      <three-mesh-standard-material color="#888"></three-mesh-standard-material>
    </three-mesh>

    <!-- Orbit controls, because they're cool! -->
    <three-orbit-controls></three-orbit-controls>

    <!-- Lights -->
    <three-ambient-light intensity="0.2"></three-ambient-light>
    <three-directional-light
      intensity="0.8"
      position="40, 40, 20"
      cast-shadow
    ></three-directional-light>
  </three-scene>
</three-game>
```

:::
