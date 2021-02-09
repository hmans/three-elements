import { expect, fixture, nextFrame, html } from "@open-wc/testing"
import * as THREE from "three"
import "../../src"
import { ThreeElement, ThreeScene } from "../../src"
import { applyProp, applyProps, applyPropWithDirective } from "../../src/util/applyProps"

describe("applyProp", () => {
  it("can directly assign root-level properties", () => {
    const object = {
      foo: 0
    }
    applyProp(object, "foo", 1)
    expect(object.foo).to.equal(1)
  })

  it("can assign nested properties", () => {
    const object = {
      foo: {
        bar: 0
      }
    }
    applyProp(object, "foo.bar", 1)
    expect(object.foo.bar).to.equal(1)
  })

  it("parses numerical values as floats", () => {
    const object = {
      foo: 0
    }
    applyProp(object, "foo", "1.5")
    expect(object.foo).to.equal(1.5)
  })

  it("parses '0' as 0", () => {
    const object = {
      foo: 1
    }
    applyProp(object, "foo", "0")
    expect(object.foo).to.equal(0)
  })

  it("parses '123deg' to the corresponding radian value", () => {
    const object = {
      foo: 0
    }
    applyProp(object, "foo", "90deg")
    expect(object.foo).to.equal(Math.PI / 2)
  })

  it("handles a list of '...deg' values correctly if the assigned property has a .set method", () => {
    const object = {
      foo: new THREE.Vector3()
    }
    applyProp(object, "foo", "90deg 1.23 -90deg")
    expect(object.foo.x).to.equal(Math.PI / 2)
    expect(object.foo.y).to.equal(1.23)
    expect(object.foo.z).to.equal(Math.PI / -2)
  })

  it("handles a JSON array correctly", () => {
    const object = {
      foo: new THREE.Vector3()
    }
    applyProp(object, "foo", "[1, 2, 3]")
    expect(object.foo.x).to.equal(1)
    expect(object.foo.y).to.equal(2)
    expect(object.foo.z).to.equal(3)
  })
})

describe("applyProps", () => {
  const object = {
    foo: 0,
    bar: 0
  }

  it("assigns multiple values", () => {
    applyProps(object, { foo: 1, bar: 2 })
    expect(object.foo).to.equal(1)
    expect(object.bar).to.equal(2)
  })
})

describe("applyPropWithDirective", () => {
  const renderGame = () =>
    fixture(html`
      <three-game>
        <three-scene>
          <three-perspective-camera id="cam"></three-perspective-camera>
        </three-scene>
      </three-game>
    `)

  describe("with the ref: directive", () => {
    it("treats the value as a DOM reference", async () => {
      await renderGame()

      const $scene = document.querySelector("three-scene") as ThreeScene
      const $camera = document.querySelector("three-perspective-camera") as ThreeElement

      applyPropWithDirective($scene, "ref:camera", "#cam")

      expect($scene.camera).to.be.instanceOf(THREE.PerspectiveCamera)
      expect($scene.camera).to.eq($camera.object)
    })
  })

  describe("with unknown directives", () => {
    it("logs an error message", async () => {
      await renderGame()
      const $scene = document.querySelector("three-scene") as ThreeScene
      applyPropWithDirective($scene, "absolutelyunknown:camera", "#cam")
    })
  })
})
