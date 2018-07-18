declare var ExternalObject: any

declare class Promise<T> {
  static resolve<T>(value: T): Promise<T>
}
