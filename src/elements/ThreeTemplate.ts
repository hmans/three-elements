/*
It would be easier to just customize HTMLTemplateElement here, but that would
not work on Safari, so we gotta do some extra work instead.
*/
export class ThreeTemplate extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: "open" })

    /* Steal the only child */
    const child = this.firstElementChild

    /* Clear our contents because we don't want to actually render them */
    this.innerHTML = ""

    /* Create a new HTML element. It's a crazy world out there. */
    const tag = this.getAttribute("tag")

    if (!tag || tag === "") {
      console.error("You must specify the tag attribute when defining a <three-template>.")
      return
    }

    const klass = class extends HTMLElement {
      child = child

      constructor() {
        super()
      }

      connectedCallback() {
        /* Let's make a shadow DOM! */
        this.attachShadow({ mode: "open" })

        /* Copy the template over into our shadow DOM */
        const element = this.child!.cloneNode(true) as HTMLElement
        this.shadowRoot!.appendChild(element)

        // /* Apply all extra attributes we have */
        for (const key of this.getAttributeNames()) {
          element.setAttribute(key, this.getAttribute(key)!)
        }
      }
    }

    customElements.define(tag, klass)
  }

  connectedCallback() {}
}

customElements.define("three-template", ThreeTemplate)
