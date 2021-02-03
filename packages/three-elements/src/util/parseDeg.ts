import { MathUtils } from "three"

export const parseDeg = (value: string) => {
  const r = value.trim().match(/^([0-9\.\- ]+)deg$/)
  if (r) return MathUtils.degToRad(parseFloat(r[1]))
}
