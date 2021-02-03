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
    expect(dasherize("UUIDThing")).to.eq("uuid-thing")
  })

  it("converts strings with multiple capitals correctly", () => {
    expect(dasherize("WebGLRenderer")).to.eq("webgl-renderer")
  })

  it("converts number suffixes correctly", () => {
    expect(dasherize("Vector3")).to.eq("vector3")
    expect(dasherize("Object3D")).to.eq("object3d")
    expect(dasherize("Float16BufferAttribute")).to.eq("float16-buffer-attribute")
    expect(dasherize("Deg2Rad")).to.eq("deg2-rad")
  })

  it("converts weird names with underscores correctly", () => {
    expect(dasherize("RGBA_ASTC_10x10_Format")).to.eq("rgba-astc-10x10-format")
  })
})
