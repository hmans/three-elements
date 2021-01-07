import { IStringIndexable } from "../types"

const IGNORED_KEYS = ["id"]

export const applyProps = (object: IStringIndexable, props: IStringIndexable) => {
  for (const key in props) {
    const value = props[key]
    let parsed = undefined

    try {
      parsed = JSON.parse(value)
    } catch (e) {}

    switch (true) {
      /* Skip ignored keys */
      case IGNORED_KEYS.includes(key):
        break

      /* Ignore all data- keys */
      case key.startsWith("data-"):
        break

      /* Handle nested keys, ie. position-x */
      case key.indexOf("-") > -1:
        const [property, ...rest] = key.split("-")
        applyProps(object[property], { [rest.join("-")]: value })
        break

      /* Handle properties that provide .set methods */
      case object[key]?.set !== undefined:
        switch (true) {
          /* If the value is an array, feed its destructured representation to the set method. */
          case Array.isArray(parsed):
            object[key].set(...parsed)
            break

          /* A bit of special handling for "scale" properties, where we'll also accept a single numerical value */
          case key === "scale" && typeof parsed === "number":
            object[key].setScalar(parsed)
            break

          /* Otherwise, we'll just directly assign whatever value was passed. */
          default:
            object[key].set(parsed || value)
        }
        break

      default:
        object[key] = parsed || value
    }
  }
}
