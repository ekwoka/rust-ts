import { RustIterator } from './iterators'
const iter = function <T>(this: Iterable<T>) {
  return new RustIterator(this)
}
Array.prototype.iter = iter
String.prototype.iter = iter
Set.prototype.iter = iter
Map.prototype.iter = iter

// biome-ignore lint/suspicious/noEmptyBlockStatements: Necessary to get Generator
const Generator = (function* () {})().constructor as Generator<
  unknown,
  unknown,
  unknown
>['constructor']

Generator.prototype.iter = iter

// Gets Iterator from Generator
Object.getPrototypeOf(Generator.prototype).iter = iter

declare global {
  interface Array<T> {
    /**
     * Create a RustIterator from an Array.
     * @returns {RustIterator<T>}
     */
    iter(): RustIterator<T>
  }

  interface String {
    /**
     * Create a RustIterator over each character of a String.
     * @returns {RustIterator<string>}
     */
    iter(): RustIterator<string>
  }

  interface Set<T> {
    /**
     * Create a RustIterator from a Set.
     * @returns {RustIterator<T>}
     */
    iter(): RustIterator<T>
  }

  interface Map<K, V> {
    /**
     * Create a RustIterator from a Map.
     * @returns {RustIterator<[K, V]>}
     */
    iter(): RustIterator<[K, V]>
  }

  // biome-ignore lint/correctness/noUnusedVariables: Necessary for Extension
  interface Generator<T, TReturn, TNext> {
    /**
     * Create a RustIterator from a Generator.
     * @returns {RustIterator<T>}
     */
    iter(): RustIterator<T>
  }

  interface Iterator<T> {
    /**
     * Create a RustIterator from an Iterator.
     * @returns {RustIterator<T>}
     */
    iter(): RustIterator<T>
  }
}
