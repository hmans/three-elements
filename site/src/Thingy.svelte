<script>
  function rotate(dt) {
    this.object.rotateZ(3 * dt)
    this.game.requestFrame()
  }

  function rotateDeconstruct(dt, { object, game }) {
    object.rotateZ(3 * dt)
    game.requestFrame()
  }

  const rotateArrow = (dt, { object, game }) => {
    object.rotateZ(3 * dt)
    game.requestFrame()
  }

  const rotateString = "dt => { this.object.rotateZ(3 * dt); this.game.requestFrame() }"

  const rotateString2 = "(dt, { object, game }) => { object.rotateZ(3 * dt); game.requestFrame() }"
</script>

<!-- Mesh -->
<three-mesh scale="2.5" onupdate={rotateDeconstruct}>
  <three-dodecahedron-buffer-geometry />
  <three-mesh-standard-material color="hotpink" />
</three-mesh>
