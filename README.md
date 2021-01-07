[![Version](https://img.shields.io/npm/v/three-elements)](https://www.npmjs.com/package/three-elements)
[![CI](https://github.com/hmans/three-elements/workflows/CI/badge.svg)](https://github.com/hmans/three-elements/actions?query=workflow%3ACI)
[![Downloads](https://img.shields.io/npm/dt/three-elements.svg)](https://www.npmjs.com/package/three-elements)
[![Bundle Size](https://img.shields.io/bundlephobia/min/three-elements?label=bundle%20size)](https://bundlephobia.com/result?p=three-elements)

```
            @hmans presents:
 __   __                                   __                              __
|  |_|  |--.----.-----.-----.______.-----.|  |.-----.--------.-----.-----.|  |_.-----.
|   _|     |   _|  -__|  -__|______|  -__||  ||  -__|        |  -__|     ||   _|__ --|
|____|__|__|__| |_____|_____|      |_____||__||_____|__|__|__|_____|__|__||____|_____|

           . .::[ WEB COMPONENTS-POWERED THREE.JS ]::. .
```

## SUMMARY

<!-- prettier-ignore -->
```html
<html>
  <body>
    <three-game>
      <!-- lights -->
      <three-ambient-light intensity="0.2"></three-ambient-light>
      <three-directional-light intensity="0.8" position="[10, 10, 50]"></three-directional-light>

      <!-- scene contents -->
      <three-mesh
        scale="4"
        onupdate="this.object.rotation.x = this.object.rotation.y += 1 * delta">

        <three-dodecahedron-buffer-geometry attach="geometry"></three-dodecahedron-buffer-geometry>
        <three-mesh-standard-material attach="material" color="hotpink"></three-mesh-standard-material>

      </three-mesh>
    </three-game>
  </body>
</html>
```
