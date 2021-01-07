export interface IConstructable<T = any> {
  new (...args: any): T
}

export interface IStringIndexable {
  [key: string]: any
}
