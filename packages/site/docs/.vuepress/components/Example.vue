<template>
  <div>
    <h2>Running Example:</h2>
    <slot />
    <h2>Source Code:</h2>
    <xmp v-html="input"></xmp>
  </div>
</template>

<script>
module.exports = {
  data() {
    return {
      input: `
    <three-game>
      <three-scene background-color="#eee">
        <three-ambient-light intensity="0.2"></three-ambient-light>
        <three-directional-light
          intensity="0.8"
          position="10, 40, 50"
          cast-shadow
        ></three-directional-light>

        <three-mesh scale="2.5">
          <three-dodecahedron-buffer-geometry></three-dodecahedron-buffer-geometry>
          <three-mesh-normal-material></three-mesh-normal-material>
        </three-mesh>

        <three-orbit-controls />
      </three-scene>
    </three-game>

      `
    }
  }
}
</script>
