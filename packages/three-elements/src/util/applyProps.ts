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

export const applyProp = (
  object: IStringIndexable,
  name: string,
  value: any,
  directive: string = ""
): boolean => {
  let [firstKey, ...rest] = name.split(/[\.:]/)

  /* Check for "ref" directive */
  if (firstKey === "ref") {
    return applyProp(object, rest.join("."), value, "ref")
  }

  const key = camelize(firstKey)

  /* Skip all ignored keys. */
  if (IGNORED_KEYS.includes(key)) return false

  /* Skip all data attributes. */
  if (firstKey.startsWith("data-")) return false

  /* Recursively handle nested keys, eg. position.x */
  if (key in object && rest.length > 0) {
    return applyProp(object[key], rest.join("."), value, directive)
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
  Is the property an object? In that case, we'll assume that the string value of the attribute
  contains a DOM selector that references another object that we should assign here.
  */
  if (key in object && directive === "ref") {
    const referencedObject = getThreeObjectBySelector(value)

    if (referencedObject) {
      object[key] = referencedObject
      return true
    } else {
      return false
    }
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
