# The Basics

::: tip Attributes vs. Properties

three-elements provides a set of Custom Elements that can be added to your DOM just like any other HTML tag. And, equally like any other HTML tag, each three-elements tag is backed by a JavaScript object.

When working with three-elements, you can either interact with an element's attributes, or its properties. In fact, you will very likely do a lot of both! There is a number of differences in both approaches, and you will learn over time when to use what.

**This guide uses static HTML, so we will focus on setting attributes**, but three-elements unleashes its full power when you interact with it from JavaScript, possibly together with one of the many web frameworks available.

Also see: [Frameworks](/advanced/frameworks)
:::

## Hello World

Let's start with a very basic Hello World-style example and dissect it. We're going to create a simple scene with a **background color**, some **lights**, and a spinning **dodecahedron**. Here's the example together with its source code:

::: demo

```html
<three-game autorender>
  <three-scene background-color="#eee">
    <!-- Spinning dodecahedron -->
    <three-mesh scale="4" tick="object.rotation.x = object.rotation.y += 0.01">
      <three-dodecahedron-buffer-geometry></three-dodecahedron-buffer-geometry>
      <three-mesh-standard-material
        color="hotpink"
        metalness="0.5"
        roughness="0.5"
      ></three-mesh-standard-material>
    </three-mesh>

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

## The `<three-game>` tag

Every three-elements projects starts with the `<three-game>` tag, which forms the root of your application's declarative HTML structure. It creates a renderer and a ticker and then gets out of your way.

::: tip
You may have noticed that we're also setting its `autorender` attribute. three-elements has a mechanism called Optimized Rendering that helps you render new frames only when something has changed in the scene; this typically requires a little bit more effort on your side.

Setting the `autorender` attribute on the `<three-game>` tag simply makes sure that a new frame is being rendered on every tick. Easy!

Also see: [Optimized Rendering](/advanced/optimized-rendering)
:::

## The `<three-scene>` tag

The `<three-game>` tag expects to have one or more `<three-scene>` tags as its immediate children. Everything that you want to actually render must exist within one of these scenes.

When you have multiple `<three-scene>` tags, all scenes will be rendered on top of each other, in sequence, for every frame.

In the example above, we're also setting the scene's `background-color` attribute.

Also see: [Stacked Scenes](/advanced/stacked-scenes)

::: tip
If you're coming from Unity, this may be a bit confusing, since there a "scene" is understood to be a discrete part of your game. In a three-elements project, you change from one part of your game (like from one level to another) by adding and removing elements to and from your DOM.
:::

## Scene Objects

Anything that exists within a `<three-scene>` tag will automatically be added to that scene's graph of objects. In the example above, we're using `<three-mesh>` to create an instance of [THREE.Mesh](https://threejs.org/docs/#api/en/objects/Mesh), and instead of imperatively assigning it a geometry and material, we're using nested `<three-dodecahedron-buffer-geometry>` and `<three-mesh-standard-material>` tags.

## Nesting Objects

Just like in Three.js itself, you can nest scene objects. three-elements will try to parent every scene object to its nearest potential parent object. Things will typically just work as expected. Here's an example:

::: demo

```html
<three-game autorender>
  <three-scene background-color="#eee">
    <!-- Spinning dodecahedron -->
    <three-mesh scale="2" tick="object.rotation.x = object.rotation.y += 0.01">
      <three-dodecahedron-buffer-geometry></three-dodecahedron-buffer-geometry>
      <three-mesh-standard-material
        color="hotpink"
      ></three-mesh-standard-material>

      <!--
      Here's a child dodecahedron that will rotate around its own axes,
      but will also be rotated by its parent.
      -->
      <three-mesh
        scale="0.5"
        position.x="2"
        tick="object.rotation.x = object.rotation.y += 0.01"
      >
        <three-dodecahedron-buffer-geometry></three-dodecahedron-buffer-geometry>
        <three-mesh-standard-material
          color="#333"
        ></three-mesh-standard-material
      ></three-mesh>
    </three-mesh>

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

## Setting Attributes

**Attributes** on elements will typically set the **corresponding property** on the wrapped Three.js object. Some examples:

```html
<!-- Sets intensity to 0.8 and castShadow to true. -->
<three-directional-light intensity="0.8" cast-shadow></three-directional-light>
```

Properties that expose a `.set(x, y, z)` method -- like [THREE.Vector3](https://threejs.org/docs/index.html#api/en/math/Vector3) and others -- can be set using a comma or whitespace separated list of values, or a JSON array:

```html
<!-- Equivalent to invoking mesh.position.set(0, 5, 0) -->
<three-mesh position="0, 5, 0"></three-mesh>
<three-mesh position="0 5 0"></three-mesh>
<three-mesh position="[0, 5, 0]"></three-mesh>
```

You can also use **dotty attributes** to set nested properties:

```html
<!-- Equivalent to mesh.position.x = -5 -->
<three-mesh position.x="-5"></three-mesh>
```

## The `deg` shorthand

When setting attributes that describe rotations, you can use a `deg` shorthand for providing values in degrees instead of radians:

```html
<three-mesh rotation.x="90deg"></three-mesh>
<three-mesh rotation="90deg, 0, -90deg"></three-mesh>
```

## Constructor Arguments

Every element will create its own instance of its corresponding class. The `args` attribute allows you to provide a list of constructor arguments:

```html
<three-box-buffer-geometry args="2, 1, 1"></three-box-buffer-geometry>
```

::: tip
Only very few Three.js classes _require_ you to use constructor arguments; most will let you set their most important properties after they've been instantiated. Please keep the [Three.js documentation](https://threejs.org/docs/) nearby as a reference.
:::
