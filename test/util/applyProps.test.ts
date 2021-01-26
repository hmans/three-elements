import { expect } from "@open-wc/testing"
import { parseProps, applyProps } from "../../src/util/applyProps"

describe("parseProps", () => {
  it("leaves strings alone", () => {
    const string = parseProps("String")
    expect(string).to.equal("String")
  })

  it("can parse radians to floats", () => {
    const radians = parseProps("3.14")
    expect(radians).to.equal(3.14)
  })

  it("can parse deg(180) to π radians", () => {
    const degrees = parseProps("deg(180)")
    expect(degrees).to.equal(Math.PI)
  })
})

describe("applyProps", () => {
  it("can directly assign root-level properties", () => {
    const object = {
      foo: 0
    }
    applyProps(object, { foo: 1 })
    expect(object.foo).to.equal(1)
  })

  it("can assign nested properties", () => {
    const object = {
      foo: {
        bar: 0
      }
    }
    applyProps(object, { "foo.bar": 1 })
    expect(object.foo.bar).to.equal(1)
  })

  it("can parses numerical values as floats", () => {
    const object = {
      foo: 0
    }
    applyProps(object, { foo: "1.5" })
    expect(object.foo).to.equal(1.5)
  })

  it("can correctly parses '0' to a 0", () => {
    const object = {
      foo: 1
    }
    applyProps(object, { foo: "0" })
    expect(object.foo).to.equal(0)
  })
})
