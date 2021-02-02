# Reusing Resources

Sometimes you may want to re-use resources in your project; for example, you may want to use the same geometry or material for multiple meshes. While using three-elements from JavaScript puts all the options of interacting with the Three.js API at your disposal &ndash; just assign a geometry or material object directly to a Mesh instance &ndash; you can also do this declaratively by specifying CSS selectors:

```html
<!-- Resources we'll reuse -->
<three-box-buffer-geometry
  id="geometry"
  args="1, 5, 1"
></three-box-buffer-geometry>
<three-mesh-standard-material
  id="material"
  color="gold"
  metalness="0.5"
  roughness="0.5"
></three-mesh-standard-material>

<!-- A bunch of meshes using the same resources -->
<three-mesh
  geometry="#geometry"
  material="#material"
  position.x="-5"
></three-mesh>
<three-mesh
  geometry="#geometry"
  material="#material"
  position.x="0"
></three-mesh>
<three-mesh
  geometry="#geometry"
  material="#material"
  position.x="+5"
></three-mesh>
```
