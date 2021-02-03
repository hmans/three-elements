import { makeProxy } from "@three-elements/proxy"
import { h } from "preact"
import * as THREE from "three"

type THREE = typeof THREE

type PreactProxyFunction = (props?: any, children?: any[]) => any

type PreactProxy = {
  [K in keyof THREE]: PreactProxyFunction
}

export const T = (makeProxy((tagName) => (props = null, children = []) =>
  h(tagName, props, children)
) as unknown) as PreactProxy
