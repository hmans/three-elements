import { expect } from "@open-wc/testing"
import { parseProps, applyProps } from "../../src/util/applyProps"

describe("parseProps", () => {
  it("can parse radians to floats", () => {
    const props = parseProps("3.14")
    expect(props).to.equal(3.14)
  })

  it("can parse deg(180) to Pi radians", () => {
    const prop = parseProps("deg(180)")
    expect(prop).to.equal(Math.PI)
  })

  it("can parse [deg(180), deg(20), deg(-20)] to radians", () => {
    const [x, y, z] = parseProps("[deg(180), deg(20), deg(-20)]") as Number[]
    expect(x).to.equal(Math.PI)
    expect(y).to.equal(Math.PI / 9)
    expect(z).to.equal(-Math.PI / 9)
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
