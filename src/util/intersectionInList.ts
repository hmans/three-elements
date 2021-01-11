import { Intersection } from "three"

export const intersectionInList = (intersection: Intersection, list: Intersection[]) =>
  list.find((i) => i.object === intersection.object && i.instanceId === intersection.instanceId)
