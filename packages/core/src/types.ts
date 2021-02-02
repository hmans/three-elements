export interface IConstructable<T = any> {
  new (...args: any): T
}

export interface IStringIndexable {
  [key: string]: any
}

interface IDisposable {
  dispose: Function
}

/**
 * Custom type guard that checks if the given object implements the IDisposable interface.
 * @param object Object to check
 */
export const isDisposable = (object: any): object is IDisposable => {
  return object && "dispose" in object
}
