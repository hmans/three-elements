<three-scene>
  <!-- Lights -->
  <three-ambient-light intensity="0.2" />
  <three-directional-light intensity="0.8" position="10, 10, 50" />

  <!-- Mesh -->
  <three-mesh scale="2.5">
    <three-dodecahedron-buffer-geometry />
    <three-mesh-standard-material color="hotpink" />
  </three-mesh>

  <three-orbit-controls />
</three-scene>
