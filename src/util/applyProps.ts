import { IStringIndexable } from "../types"
import { camelize } from "./camelize"
import { MathUtils } from "three"

const IGNORED_KEYS = ["id"]

export const applyProps = (object: IStringIndexable, props: IStringIndexable) => {
  for (const incoming in props) {
    const value = props[incoming]
    let [firstKey, ...rest] = incoming.split(/[\.:]/)

    const key = camelize(firstKey)

    /* Attempt to parse the value */
    const parsed = parseJson(value)

    /* Skip all ignored keys. */
    if (IGNORED_KEYS.includes(key)) return

    /* Skip all data attributes. */
    if (firstKey.startsWith("data-")) return

    /* Handle nested keys, eg. position.x */
    if (key in object && rest.length > 0)
      return applyProps(object[key], { [rest.join(".")]: value })

    /*
    Handle boolean properties. We will check against the only values that we consider falsey here,
    taking into account that they might be coming from string-based HTML element attributes, where a
    stand-alone boolean attribute like "cast-shadow" will emit a value of "". Eh!
    */
    if (typeof object[key] === "boolean") {
      object[key] = ![undefined, null, false, "no", "false"].includes(value)
      return
    }

    /* Handle properties that provide .set methods */
    if (object[key]?.set !== undefined) {
      /* If the value is an array, feed its destructured representation to the set method. */
      if (Array.isArray(parsed)) {
        object[key].set(...parsed)
        return
      }

      /* A bit of special handling for "scale" properties, where we'll also accept a single numerical value */
      if (key === "scale" && typeof parsed === "number") {
        object[key].setScalar(parsed)
        return
      }

      /* If we have a parsed value, set it directly */
      if (parsed) {
        object[key].set(parsed)
        return
      }

      /* Otherwise, set the original string value, but split by commas */
      const list = value.split(",").map((el: string) => parseFloat(el) || el)
      object[key].set(...list)
      return
    }

    /*
    If we've reached this point, we're finally able to set a property on the object.
    Amazing! But let's only do it if the property key is actually known.
    */
    if (key in object) object[key] = parsed !== undefined ? parsed : value
  }
}

const parseJson = (value: string) => {
  let parsed = undefined

  try {
    parsed = JSON.parse(value)
  } catch (e) {}

  return parsed
}
