import { expect } from "@open-wc/testing"
import { dasherize } from "../../src/util/dasherize"

describe("dasherize", () => {
  it("converts a camelCase string to a dasherized version", () => {
    expect(dasherize("fooBar")).to.eq("foo-bar")
    expect(dasherize("fooBarBaz")).to.eq("foo-bar-baz")
  })

  it("converts a PascalCase string to a dasherized version", () => {
    expect(dasherize("FooBar")).to.eq("foo-bar")
    expect(dasherize("FooBarBaz")).to.eq("foo-bar-baz")
  })

  it("converts number suffixes corretly", () => {
    expect(dasherize("Vector3")).to.eq("vector3")
    expect(dasherize("Object3D")).to.eq("object3d")
    expect(dasherize("Deg2Rad")).to.eq("deg2rad")
  })
})
