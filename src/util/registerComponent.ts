/**
 * Convenience method to create a new custom element.
 *
 * @param name Name of the custom element to create
 * @param constructor Class that will handle this element
 */
export const registerComponent = (name: string, constructor: CustomElementConstructor) => {
  if (customElements.get(name)) return
  customElements.define(name, constructor)
}
