import { makeProxy } from "@three-elements/proxy"
import { h } from "preact"
import * as THREE from "three"

type THREE = typeof THREE

type AllPossibleAttributes<T> = {
  [K in keyof T]: T[K] extends Function ? never : T[K]
}

type ThreeElementAttributes<T> = Partial<AllPossibleAttributes<T>>

type PreactProxyFunction<T> = (
  props?: ThreeElementAttributes<T>,
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
