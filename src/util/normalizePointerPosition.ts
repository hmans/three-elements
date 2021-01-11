import { Renderer, Vector2 } from "three"

export const normalizePointerPosition = (
  renderer: Renderer,
  x: number,
  y: number,
  target?: Vector2
) => {
  if (!target) target = new Vector2()

  target.x = (x / renderer.domElement.clientWidth) * 2 - 1
  target.y = -(y / renderer.domElement.clientHeight) * 2 + 1

  return target
}
