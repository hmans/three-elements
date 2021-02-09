import { IStringIndexable } from "../types"
import { attributeValueToArray } from "./attributeValueToArray"
import { camelize } from "./camelize"
import { getThreeObjectBySelector } from "./getThreeObjectBySelector"
import { parseDeg } from "./parseDeg"

const IGNORED_KEYS = ["id"]

export const applyProps = (object: IStringIndexable, props: IStringIndexable) => {
  for (const name in props) {
    applyProp(object, name, props[name])
  }
}

export const applyPropWithDirective = (
  object: IStringIndexable,
  name: string,
  value: any
): boolean => {
  let [directive, rest] = name.split(":")

  /* If no rest was returned, there was no directive. */
  if (!rest) return applyProp(object, name, value)

  /* Resolve "ref" directive */
  switch (directive) {
    case "ref":
      const referencedObject = getThreeObjectBySelector(value)
      return referencedObject ? applyProp(object, rest, referencedObject) : false

    default:
      console.error(`Unknow directive: ${directive}`)
      return false
  }
}

export const applyProp = (object: IStringIndexable, name: string, value: any): boolean => {
  let [firstKey, ...rest] = name.split(".")

  const key = camelize(firstKey)

  /* Skip all ignored keys. */
  if (IGNORED_KEYS.includes(key)) return false

  /* Skip all data attributes. */
  if (firstKey.startsWith("data-")) return false

  /* Recursively handle nested keys, eg. position.x */
  if (key in object && rest.length > 0) {
    return applyProp(object[key], rest.join("."), value)
  }

  /*
  Handle boolean properties. We will check against the only values that we consider falsey here,
  taking into account that they might be coming from string-based HTML element attributes, where a
  stand-alone boolean attribute like "cast-shadow" will emit a value of "". Eh!
  */
  if (typeof object[key] === "boolean") {
    object[key] = ![undefined, null, false, "no", "false"].includes(value)
    return true
  }

  /*
  Handle function properties, but only if their name starts with "on".
  */
  if (typeof object[key] === "function") {
    if (key.startsWith("on")) {
      object[key] = new Function(value).bind(object)
      return true
    } else {
      return false
    }
  }

  /* It is attribute-setting time! Let's try to parse the value. */
  const parsed = typeof value === "string" ? parseJson(value) ?? parseDeg(value) : value

  /* Handle properties that provide .set methods */
  if (object[key]?.set !== undefined) {
    /* If the value is an array, feed its destructured representation to the set method. */
    if (Array.isArray(parsed)) {
      object[key].set(...parsed)
      return true
    }

    /* A bit of special handling for "scale" properties, where we'll also accept a single numerical value */
    if (key === "scale" && typeof parsed === "number") {
      object[key].setScalar(parsed)
      return true
    }

    /* If we have a parsed value, set it directly */
    if (parsed) {
      object[key].set(parsed)
      return true
    }

    /* Otherwise, set the original string value, but split by commas */
    const list = attributeValueToArray(value)
    object[key].set(...list)
    return true
  }

  /*
  If we've reached this point, we're finally able to set a property on the object.
  Amazing! But let's only do it if the property key is actually known.
  */
  if (key in object) {
    object[key] = parsed !== undefined ? parsed : value
    return true
  } else {
    return false
  }
}

const parseJson = (value: string) => {
  let parsed = undefined

  try {
    parsed = JSON.parse(value)
  } catch (e) {}

  return parsed
}
