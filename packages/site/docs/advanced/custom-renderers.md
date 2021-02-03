# Custom Renderers

## The Default Renderer

The `<three-game>` tag will, among other things, automatically create a WebGL renderer for you and configure it with these default settings:

- Power preference: high
- Antialiasing: enabled
- Shadowmaps: enabled
- Output Encoding: sRGB

You can customize these by interacting with the element's `renderer` property, but you can also declaratively configure a custom renderer that will override the default one in your project.

## Creating a Custom Renderer

```html
<three-game>
  <three-web-gl-renderer xr.enabled antialias="false"></three-web-gl-renderer>
  <three-scene></three-scene>
</three-game>
```

These custom renderers will automatically be picked up by your game, and you should only ever have one of them at the same time.

Currently, you can create any type of renderer with it that lives on the main `THREE` namespace. Support for renderers like `CSS3DRenderer` or `SVGRenderer` will be added in a future update.
