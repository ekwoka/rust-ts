import { RustIterator } from './iterators'
const iter = function <T>(this: Iterable<T>) {
  return new RustIterator(this)
}
String.prototype.iter = iter
Array.prototype.iter = iter
Set.prototype.iter = iter
Map.prototype.iter = iter
// biome-ignore lint/suspicious/noEmptyBlockStatements: Necessary to get Generator
const Generator = (function* () {})().constructor as Generator<
  unknown,
  unknown,
  unknown
>['constructor']

Generator.prototype.iter = iter
Object.getPrototypeOf(Generator.prototype).iter = iter

declare global {
  interface Set<T> {
    iter(): RustIterator<T>
  }

  interface Map<K, V> {
    iter(): RustIterator<[K, V]>
  }

  interface String {
    iter(): RustIterator<string>
  }

  interface Array<T> {
    iter(): RustIterator<T>
  }

  // biome-ignore lint/correctness/noUnusedVariables: Necessary for Extension
  interface Generator<T, TReturn, TNext> {
    iter(): RustIterator<T>
  }

  interface Iterator<T> {
    iter(): RustIterator<T>
  }
}
