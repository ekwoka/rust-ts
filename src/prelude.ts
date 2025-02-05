/**
 * This module contains code that can attach additional behaviors to the JavaScript Standard Library.
 *
 * Currently, this fills in `iter` methods for Arrays, Strings, Sets, Maps, Generators, and Iterators.
 *
 * This allows you to easily take advantage of the Rust-like iterator methods provided by the `RustIterator` class, without the clunky class instantiation.
 *
 * @module Prelude
 *
 * @example
 * import '@ekwoka/rust-ts/prelude';
 *
 * [1, 2, 3].iter().map(x => x * 2).collect(); // [2, 4, 6]
 */

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
     * Create a {@linkcode RustIterator} from an Array.
     */
    iter(): RustIterator<T>
  }

  interface String {
    /**
     * Create a {@linkcode RustIterator} over each character of a String.
     */
    iter(): RustIterator<string>
  }

  interface Set<T> {
    /**
     * Create a {@linkcode RustIterator} from a Set.
     */
    iter(): RustIterator<T>
  }

  interface Map<K, V> {
    /**
     * Create a {@linkcode RustIterator} from a Map.
     */
    iter(): RustIterator<[K, V]>
  }

  // biome-ignore lint/correctness/noUnusedVariables: Necessary for Extension
  interface Generator<T, TReturn, TNext> {
    /**
     * Create a {@linkcode RustIterator} from a Generator.
     */
    iter(): RustIterator<T>
  }

  interface Iterator<T> {
    /**
     * Create a {@linkcode RustIterator} from an Iterator.
     */
    iter(): RustIterator<T>
  }
}
