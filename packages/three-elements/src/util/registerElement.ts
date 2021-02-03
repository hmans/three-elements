import { IConstructable } from "../types"

/**
 * Convenience method to create a new custom element.
 *
 * @param name Name of the custom element to create
 * @param constructor Class that will handle this element
 */
export const registerElement = (name: string, constructor: CustomElementConstructor) => {
  if (customElements.get(name)) return
  customElements.define(name, constructor)
}

/**
 * Tracks registered elements by mapping them from PascalPaseNames to their kebab-case
 * equivalents.
 */
export const registeredThreeElements: Record<string, string> = {}

/**
 * Registers an element and adds it to the dictionary that's mapping THREE.* namespace
 * properties to tag names.
 */
export const registerThreeElement = (
  tagName: string,
  threeName: string,
  klass: IConstructable<HTMLElement>
) => {
  registerElement(tagName, klass)
  registeredThreeElements[threeName] = tagName
}
