import { ThreeElement } from "../ThreeElement"

/**
 * Experimental helper to retrieve a Three.js object from a ThreeElement
 * referenced by CSS selector.
 */
export const getThreeObjectBySelector = (selector: string) => {
  const el = document.querySelector(selector)

  if (el instanceof ThreeElement) {
    return el.object
  }
}
