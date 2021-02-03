import { expect } from "@open-wc/testing"
import { T } from "../src/index"
import { h, render } from "preact"
import { ThreeElement } from "three-elements"

describe("the preact proxy object", () => {
  it("has properties for the various THREE.* props", () => {
    /* Some obvious Three stuff */
    expect(T.Object3D).not.eq(undefined)
    expect(T.Group).not.eq(undefined)
    expect(T.Scene).not.eq(undefined)

    /* Something that very likely does not exist. mrdoob, I beg you,
    don't add a THREE.FooBarBaz, or you'll break this test */
    expect(T.FooBarBaz).to.eq(undefined)
  })

  it("its members return preact vdom generator functions", () => {
    const vdom = T.Group({ name: "My Favorite Group" }, [])
    render(vdom, document.body)

    const el = document.body.firstElementChild as ThreeElement
    expect(el).to.be.instanceOf(ThreeElement)
    expect(el.object.name).to.eq("My Favorite Group")
  })
})
