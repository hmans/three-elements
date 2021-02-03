import { Intersection } from "three"

export const intersectionEquals = (a: Intersection, b: Intersection) =>
  a.object === b.object && a.instanceId === b.instanceId
