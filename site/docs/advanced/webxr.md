# WebXR

## Workflow

three-elements makes it easy to get started with WebXR.

You can enable WebXR features by adding the `xr` attribute to `<three-game>`. You will also want to enable `autorender` to make sure that new frames are rendered on every engine tick.

```html
<three-game id="game" autorender xr>
  <three-scene background-color="#808080">
    <three-ambient-light intensity="1.2"></three-ambient-light>

    <three-mesh scale="4" rotation.x="-1.5707">
      <three-plane-buffer-geometry></three-plane-buffer-geometry>
      <three-mesh-standard-material
        color="#eeeeee"
      ></three-mesh-standard-material>
    </three-mesh>
  </three-scene>
</three-game>
```

Now that your app renders in XR, you have to create a way for users to step into a WebXR session. Luckily, Three.js provides an [VR button](https://github.com/mrdoob/three.js/blob/master/examples/jsm/webxr/VRButton.js) that can be added to your scene.

Simply import the button from Three.js and target your app's renderer. (HTML elements with DOM IDs automatically become available as properties on the `window` object, which allows us to directly refer to `game` in this example.)

```js
import { VRButton } from "three/examples/jsm/webxr/VRButton.js"

const button = VRButton.createButton(game.renderer)
document.body.appendChild(button)
```

Alternatively, you can create your own XR button through [navigator.xr.requestSession()](https://developer.mozilla.org/en-US/docs/Web/API/XRSystem/requestSession).

```js
const optionalFeatures = ["local-floor", "bounded-floor", "hand-tracking"]

const button = document.createElement("button")
button.onclick = navigator.xr.requestSession("immersive-vr", {
  optionalFeatures
})
document.body.appendChild(button)
```

### Configuring AR

You can configure AR by using Three.js's [ARButton](https://github.com/mrdoob/three.js/blob/master/examples/jsm/webxr/ARButton.js) and/or changing [XRSessionMode](https://developer.mozilla.org/en-US/docs/Web/API/XRSessionMode) to `immersive-ar` on custom buttons.

## Events

_TODO_

## Controllers

_TODO_

## Hand-tracking

_TODO_
