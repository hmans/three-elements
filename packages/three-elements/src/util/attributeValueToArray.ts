import { parseDeg } from "./parseDeg"

export const attributeValueToArray = (value: string) =>
  value
    .split(/[, ]+/)
    .map((s) => s.trim())
    .map((s) => parseDeg(s) ?? floatOrNot(s))

const floatOrNot = (s: string) => {
  const f = parseFloat(s)
  return f || f === 0 ? f : s
}
