/**
 * Experimental helper to retrieve a Three.js object from a ThreeElement
 * referenced by CSS selector.
 */
export const getThreeObjectBySelector = (selector: string) => {
  /* Immediately return if selector is empty */
  if (!selector) return

  /* Find the element */
  const el = document.querySelector(selector)

  /* Bail if element was not found. */
  if (!el) return

  /* Check if the element has an object */
  if (!("object" in el)) {
    console.error(
      `The DOM element found by the selector "${selector}" did not provide a Three.js object for us. 😢`
    )
    return
  }

  /* Finally, return the object! */
  return el["object"] as any
}
