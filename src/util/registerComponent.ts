export const registerComponent = (name: string, constructor: CustomElementConstructor) => {
  if (customElements.get(name)) return
  customElements.define(name, constructor)
}
