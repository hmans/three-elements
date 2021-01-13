<script>
  import { object_without_properties } from "svelte/internal"

  function rotate(dt) {
    this.object.rotateZ(3 * dt)
    this.game.requestFrame()
  }

  const rotateArrow = (dt, element) => {
    element.object.rotateZ(3 * dt)
    element.game.requestFrame()
  }

  const rotateString = "dt => { this.object.rotateZ(3 * dt); this.game.requestFrame() }"
</script>

<!-- Mesh -->
<three-mesh scale="2.5" onupdate={rotateArrow}>
  <three-dodecahedron-buffer-geometry />
  <three-mesh-standard-material color="hotpink" />
</three-mesh>
