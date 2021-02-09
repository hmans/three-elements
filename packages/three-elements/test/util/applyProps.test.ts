import { expect } from "@open-wc/testing"
import { applyProps, applyProp } from "../../src/util/applyProps"
import * as THREE from "three"

describe("applyProps", () => {
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
