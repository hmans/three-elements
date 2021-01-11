import { Intersection } from "three"
import { intersectionEquals } from "./intersectionEquals"

export const intersectionInList = (intersection: Intersection, list: Intersection[]) =>
  list.find((i) => intersectionEquals(i, intersection))
