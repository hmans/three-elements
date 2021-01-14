<script>
  export let speed = 1

  console.log("my scope:", this)

  function rotate(dt) {
    this.object.rotateZ(speed * dt)
    this.game.requestFrame()
  }

  function rotateDeconstruct(dt, { object, game }) {
    console.log("rotateDeconstruct scope", this)

    object.rotateZ(speed * dt)
    game.requestFrame()
  }

  const rotateArrow = (dt, { object, game }) => {
    object.rotateZ(speed * dt)
    game.requestFrame()
  }

  const rotateString = "dt => { this.object.rotateZ(3 * dt); this.game.requestFrame() }"

  const rotateString2 = "(dt, { object, game }) => { object.rotateZ(3 * dt); game.requestFrame() }"
</script>

<!-- Mesh -->
<three-mesh ontick={rotateDeconstruct} {...$$restProps}>
  <three-dodecahedron-buffer-geometry />
  <three-mesh-standard-material color="hotpink" />
</three-mesh>
