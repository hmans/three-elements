<script>
  import Thingy from "./Thingy.svelte"
</script>

<three-scene>
  <!-- Lights -->
  <three-ambient-light intensity="0.2" />
  <three-directional-light intensity="0.8" position="10, 10, 50" />

  <Thingy scale={5} />
  <three-orbit-controls />
</three-scene>
