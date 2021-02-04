import { makeProxy } from "@three-elements/proxy"
import { h } from "preact"
import * as THREE from "three"

/* Extract to proxy package: */

type THREE = typeof THREE

type ExposedThreeObjectProps<T> = {
  [K in keyof T]: T[K] extends Function ? never : K
}[keyof T]

type ExposedThreeObjectAttributes<T> = {
  [K in ExposedThreeObjectProps<T>]: T[K]
}

/* Preact specific: */

type PreactProxyFunction<T> = (
  props?: Partial<ExposedThreeObjectAttributes<T>>,
  ...children: preact.ComponentChildren[]
) => preact.VNode

type PreactProxy = {
  [K in keyof THREE]: THREE[K] extends { new (...args: any[]): any }
    ? PreactProxyFunction<InstanceType<THREE[K]>>
    : undefined
}

export const T = (makeProxy((tagName) => (props = null, children = []) =>
  h(tagName, props, children)
) as unknown) as PreactProxy
