import { expect } from "@open-wc/testing"
import { attributeValueToArray } from "../../src/util/attributeValueToArray"

describe("attributeValueToArray", () => {
  it("parses a singular string value to an array containing the string", () => {
    expect(attributeValueToArray("foo")).to.eql(["foo"])
  })

  it("parses a singular numerical value to an array containing the number", () => {
    expect(attributeValueToArray("123")).to.eql([123])
  })

  it("parses a '0' to the number 0", () => {
    expect(attributeValueToArray("0")).to.eql([0])
  })

  it("parses a list of numerical values to an array containing those numbers", () => {
    expect(attributeValueToArray("123, 0, -123")).to.eql([123, 0, -123])
  })

  it("parses a list of strings to an array containing those strings", () => {
    expect(attributeValueToArray("foo, bar")).to.eql(["foo", "bar"])
  })

  it("parses a list of mixed value types to an array containing the correct values", () => {
    expect(attributeValueToArray("foo, 0, 1, bar")).to.eql(["foo", 0, 1, "bar"])
  })

  it("also works without a comma", () => {
    expect(attributeValueToArray("foo 0 1 bar")).to.eql(["foo", 0, 1, "bar"])
  })

  it("also works with floating point values", () => {
    expect(attributeValueToArray("-0.5 +0.5")).to.eql([-0.5, 0.5])
  })
})
