/**
 * Experimental helper to retrieve a Three.js object from a ThreeElement
 * referenced by CSS selector.
 */
export const getThreeObjectBySelector = (selector: string) => {
  const el = document.querySelector(selector)

  if (el && "object" in el) {
    return el["object"] as any
  }
}
