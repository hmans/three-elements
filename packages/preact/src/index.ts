import { makeProxy } from "@three-elements/proxy"
import { h } from "preact"

export const T = makeProxy((tagName) => (props = null, children = []) =>
  h(tagName, props, children)
)
