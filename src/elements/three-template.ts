import { observeAttributeChange } from "../util/observeAttributeChange"
import { registerElement } from "../util/registerElement"

/*
It would be easier to just customize HTMLTemplateElement here, but that would
not work on Safari, so we gotta do some extra work instead.
*/
export class ThreeTemplate extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: "open" })

    /* Steal the only/first child */
    const child = this.firstElementChild

    /* Clear our contents because we don't want to actually render them */
    this.innerHTML = ""

    /* Check the tag we will be using for this custom element */
    const tag = this.getAttribute("tag")

    if (!tag || tag === "") {
      console.error("You must specify the tag attribute when defining a <three-template>.")
      return
    }

    /* Create a class that will be handling the new custom element */
    const klass = class extends HTMLElement {
      element?: HTMLElement

      constructor() {
        super()
      }

      connectedCallback() {
        /* Let's make a shadow DOM! */
        this.attachShadow({ mode: "open" })

        /* Copy the template over into our shadow DOM */
        this.element = child!.cloneNode(true) as HTMLElement
        this.shadowRoot!.appendChild(this.element)

        /* Apply all extra attributes we have */
        for (const key of this.getAttributeNames()) {
          this.element.setAttribute(key, this.getAttribute(key)!)
        }

        observeAttributeChange(this, (key, value) => {
          this.element?.setAttribute(key, value)
        })
      }
    }

    /* and finally, create the custom element! It's a crazy, crazy world. */
    customElements.define(tag, klass)
  }
}

registerElement("three-template", ThreeTemplate)
