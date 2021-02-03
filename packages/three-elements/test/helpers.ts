import { fixture } from "@open-wc/testing"
import { html, TemplateResult } from "lit-html"

/**
 * Renders the given snippet in a three-game scaffolding and returns a reference
 * to the inner element.
 */
export const renderWithinGame = async <T extends Element = HTMLElement>(inner: TemplateResult) => {
  const result = await fixture(html`<three-game><three-scene>${inner}</three-scene></three-game>`)
  return result.querySelector("three-scene > :first-child") as T
}
