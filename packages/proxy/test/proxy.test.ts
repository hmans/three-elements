import { expect } from "@open-wc/testing"
import { makeProxy } from "../src"

describe("makeProxy", () => {
  it("creates a proxy that exposes THREE props which invoke the factory function", () => {
    const factory = (tagName: string) => `hello-${tagName}`
    const P = makeProxy(factory)

    expect(P.Group).to.eq("hello-three-group")
  })

  it("supports higher-order functions", () => {
    const factory = (tagName: string) => (prefix: string) => `${prefix}-${tagName}`
    const P = makeProxy(factory)

    expect(P.Group("sup")).to.eq("sup-three-group")
  })
})
