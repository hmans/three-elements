import { IStringIndexable } from "../types"

const IGNORED_KEYS = ["id"]

export const applyProps = (object: IStringIndexable, props: IStringIndexable) => {
  for (const key in props) {
    const actualKey = findActualPropertyName(object, key)
    const value = props[key]

    /* Attempt to parse the value */
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
        applyProps(object[findActualPropertyName(object, property)!], { [rest.join("-")]: value })
        break

      /* Handle properties that provide .set methods */
      case object[actualKey!]?.set !== undefined:
        switch (true) {
          /* If the value is an array, feed its destructured representation to the set method. */
          case Array.isArray(parsed):
            object[actualKey!].set(...parsed)
            break

          /* A bit of special handling for "scale" properties, where we'll also accept a single numerical value */
          case actualKey === "scale" && typeof parsed === "number":
            object[actualKey!].setScalar(parsed)
            break

          /* If we have a parsed value, set it directly */
          case parsed:
            object[actualKey!].set(parsed)
            break

          /* Otherwise, set the original string value, but split by commas */
          default:
            object[actualKey!].set(...value.split(","))
        }
        break

      default:
        if (actualKey) object[actualKey] = parsed || value
        else console.warn("Trying to assign unknown property:", key)
    }
  }
}

const findActualPropertyName = (object: IStringIndexable, key: string): string | undefined =>
  key in object ? key : findMixedCasePropertyName(object, key)

const findMixedCasePropertyName = (object: IStringIndexable, key: string): string | undefined => {
  const lowerCaseKey = key.toLowerCase()
  const names = Object.getOwnPropertyNames(object)

  return names.find((name) => name.toLowerCase() === lowerCaseKey)
}
