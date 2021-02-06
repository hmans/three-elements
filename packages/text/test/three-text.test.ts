import { expect, fixture, html } from "@open-wc/testing"
import { ThreeText } from "../src/index"

describe("three-text", () => {
  it("creates an element wrapping a Troika Text instance", async () => {
    await fixture(html`
      <three-game
        ><three-scene> <three-text text="Hello World"></three-text> </three-scene
      ></three-game>
    `)

    const textElement = document.querySelector("three-text") as ThreeText
    expect(textElement).to.be.instanceOf(ThreeText)
    expect(textElement.object.text).to.eq("Hello World")
  })

  it("assigns the color attribute correctly", async () => {
    await fixture(html`
      <three-game
        ><three-scene> <three-text text="Hello World" color="red"></three-text> </three-scene
      ></three-game>
    `)

    const textElement = document.querySelector("three-text") as ThreeText
    expect(textElement.object.material.color.getHexString()).to.eq("ff0000")
  })
})
