import { expect, fixture, html } from "@open-wc/testing"
import "../src"
import { ThreeGame } from "../src/elements/three-game"

describe("<three-game observed>", () => {
  const render = (): Promise<ThreeGame> =>
    fixture(
      html`
        <three-game observed></three-game>
      `
    )

  it("activates the game's observer", async () => {
    const game = (await render()) as ThreeGame
    expect(game.observed).to.be.true
  })
})
