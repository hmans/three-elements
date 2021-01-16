# Stacked Scenes

::: warning TODO
Stacked Scenes are really cool, but the documentation isn't quite ready yet! Hang in there!

**The tl;dr:** just create multiple sibling `<three-scene>` elements, and all these scenes will be rendered on top of each other. There you go: super-easy HUDs, cockpit views, and whatever other crazy stuff you're thinking of. (Just make sure that you only give your first scene a background color.)

```html
<three-game>
  <three-scene background-color="black">...[ShootySpaceBang]...</three-scene>
  <three-scene>...[Cockpit View]...</three-scene>
  <three-scene>...[UI]...</three-scene>
</three-game>
```

:::
