import { expect } from "@open-wc/testing"
import { T } from "../src/index"

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
})
