import { Renderer, Vector2 } from "three"

export const normalizePointerPosition = (
  renderer: Renderer,
  x: number,
  y: number,
  target?: Vector2
) => {
  if (!target) target = new Vector2()

  const rect = renderer.domElement.getBoundingClientRect()

  x -= rect.left
  y -= rect.top

  target.x = (x / rect.width) * 2 - 1
  target.y = -(y / rect.height) * 2 + 1

  return target
}
