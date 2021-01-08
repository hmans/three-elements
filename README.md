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

**three-elements is a set of Web Components-powered custom HTML elements for building Three.js-powered games and interactive experiences.** Instead of providing custom-built higher-level components (like many other libraries in this space), three-elements directly exposes all Three.js classes through automatically generated custom HTML elements, no matter which version of Three.js you're using.

**Elements are fully reactive**; if their attributes change, this is immediately reflected in the Three.js scene.

three-elements can be used standalone in static HTML, or together with the HTML application framework of your choice.

## EXAMPLE

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
