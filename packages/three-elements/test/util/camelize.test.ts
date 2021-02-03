import { expect } from "@open-wc/testing"
import { camelize } from "../../src/util/camelize"

describe("camelize", () => {
  it("converts a dasherized string to its camelCase version", () => {
    expect(camelize("foo-bar")).to.eq("fooBar")
    expect(camelize("foo-bar-baz")).to.eq("fooBarBaz")
  })

  it("leaves existing capital letters untouched", () => {
    expect(camelize("foo-barBaz")).to.eq("fooBarBaz")
    expect(camelize("Foo-barBaz")).to.eq("FooBarBaz")
    expect(camelize("foo-bar3D")).to.eq("fooBar3D")
  })
})
