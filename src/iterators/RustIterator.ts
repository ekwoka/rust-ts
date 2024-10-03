import { takeWhilePeek } from './Peekable/takeWhilePeek.js'
import { arrayChunks } from './arrayChunks.js'
import { chain } from './chain.js'
import { cycle } from './cycle.js'
import { enumerate } from './enumerate.js'
import { filter } from './filter.js'
import { depth, flat, flatMap } from './flat.js'
import { forEach } from './forEach.js'
import { inspect } from './inspect.js'
import { map } from './map.js'
import { reverse } from './reverse.js'
import { scan } from './scan.js'
import { sort } from './sort.js'
import { stepBy } from './stepBy.js'
import { take, takeWhile } from './take.js'
import { window } from './window.js'
import { zip } from './zip.js'

/**
 * A Rust-inspired iterator class.
 * Some semantics are adjusted to fit idiomatic JS and parallel JS Iterator Helpers
 * and Array Iteration Methods.
 * Rust docs: https://doc.rust-lang.org/std/iter/trait.Iterator.html
 */
export class RustIterator<T> implements IterableIterator<T> {
  private upstream: Iterator<T>

  /**
   * @param upstream {Iterator<T>}
   */
  constructor(upstream: Iterable<T>) {
    this.upstream = upstream[Symbol.iterator]()
  }

  /**
   * To implement the Iterable. Returns Self (to be IterableIterator).
   * This allows for RustIterator to be used in for-of loops, and be spread easily.
   * @returns {RustIterator<T>}
   */
  [Symbol.iterator](): RustIterator<T> {
    return this
  }

  /**
   * To implement the Extended Iterable. Returns Self (to be IterableIterator).
   * This allows for RustIterator to be used in for-of loops, and be spread easily.
   * @returns {RustIterator<T>}
   */
  iter() {
    return this
  }

  /**
   * Is this iterator capable of yielding new values.
   */
  done = false

  /**
   * Get the next value from the iterator.
   * To implement Iterator
   * @returns {IteratorResult<T>}
   */
  next(): IteratorResult<T> {
    const next = this.upstream.next()
    this.done = next.done ?? false
    return next
  }

  /**
   * Turn this iterator into a peekable iterator.
   * A Peekable Iterator allows you to peek at the next value without consuming it.
   * @returns {PeekableRustIterator<T>}
   */
  peekable(): PeekableRustIterator<T> {
    return new PeekableRustIterator(this)
  }

  nextChunk(n: number): { value: T[]; done: boolean } {
    const chunk = []
    for (let i = 0; i < n; i++) {
      const { value, done } = this.next()
      if (done) {
        return { value: chunk, done }
      }
      chunk.push(value)
    }
    return { value: chunk, done: false }
  }

  count(): number {
    let count = 0
    while (!this.next().done) count++
    return count
  }

  last(): T | undefined {
    let last
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { value, done } = this.next()
      if (done) return last
      last = value
    }
  }

  advanceBy(n: number): void {
    while (n--) this.next()
  }

  nth(n: number): T | undefined {
    this.advanceBy(n)
    return this.next().value
  }

  collect(): T[] {
    return [...this]
  }

  into(
    this: RustIterator<[unknown, unknown]>,
    container: typeof Map,
  ): T extends [infer K, infer V] ? Map<K, V> : never
  into(this: RustIterator<unknown>, container: typeof Set): Set<T>
  into(container: typeof Set | typeof Map) {
    /** @ts-expect-error - Doesn't like differing Map and Set signatures */
    return new container(this)
  }

  arrayChunks<N extends number>(size: N) {
    return new RustIterator(arrayChunks<T, N>(this, size))
  }

  map<S>(f: (val: T) => S): RustIterator<S> {
    return new RustIterator(map(this, f))
  }

  filter(f: (val: T) => boolean): RustIterator<T> {
    return new RustIterator(filter(this, f))
  }

  forEach(f: (val: T) => void): void {
    forEach(this, f)
  }

  take(n: number): RustIterator<T> {
    return new RustIterator(take(this, n))
  }

  takeWhile(f: (val: T) => boolean): RustIterator<T> {
    return new RustIterator(takeWhile(this, f))
  }

  stepBy(n: number): RustIterator<T> {
    return new RustIterator(stepBy(this, n))
  }

  chain(other: Iterable<T>): RustIterator<T> {
    return new RustIterator(chain(this, other))
  }

  zip<S = T>(other: Iterable<S>): RustIterator<[T, S]> {
    return new RustIterator(zip(this, other))
  }

  enumerate(): RustIterator<[number, T]> {
    return new RustIterator(enumerate(this))
  }

  inspect(fn: (val: T) => void): RustIterator<T> {
    return new RustIterator(inspect(this, fn))
  }

  scan<A = T, R = T>(
    fn: (state: [A], val: T) => R,
    initial: A,
  ): RustIterator<R> {
    return new RustIterator(scan(this, fn, initial))
  }

  flat<D extends depth = 1>(depth?: D) {
    return new RustIterator(flat<T, D>(this, depth))
  }
  flatMap<S>(mapper: (val: T) => S) {
    return new RustIterator(flatMap(this, mapper))
  }

  window<S extends number>(n: S) {
    return new RustIterator(window<T, S>(this, n))
  }

  cycle(): RustIterator<T> {
    return new RustIterator(cycle(this))
  }

  fold<A = T>(fn: (acc: A, item: T) => A, initial?: A): A {
    let acc = initial ?? this.next().value
    for (const item of this) acc = fn(acc, item)
    return acc
  }

  reduce(fn: (acc: T, item: T) => T, initial?: T): T {
    return this.fold(fn, initial)
  }

  sum<T extends number>(this: RustIterator<T>): number
  sum<T extends string>(this: RustIterator<T>): string
  sum<T extends bigint>(this: RustIterator<T>): bigint
  sum<T extends number | string | bigint>(this: RustIterator<T>) {
    // biome-ignore lint/suspicious/noExplicitAny: Needs Any to support multiple generics
    return this.reduce((acc: any, item: any) => acc + item)
  }

  all(checker: (item: T) => unknown): boolean {
    return !this.any((item) => !checker(item))
  }

  any(checker: (item: T) => unknown): boolean {
    return this.find(checker) !== null
  }

  find(checker: (item: T) => unknown): T | null {
    for (const item of this) if (checker(item)) return item
    return null
  }

  max(): T | undefined {
    return this.reduce((acc, item) => (item > acc ? item : acc))
  }

  min(): T | undefined {
    return this.reduce((acc, item) => (item < acc ? item : acc))
  }

  sort(compare?: (a: T, b: T) => number) {
    return new RustIterator(sort(this, compare))
  }

  position(checker: (item: T) => boolean): number | null {
    let i = 0
    for (const item of this) {
      if (checker(item)) return i
      i++
    }
    return null
  }
  findIndex(checker: (item: T) => boolean): number | null {
    return this.position(checker)
  }
  reverse() {
    return new RustIterator(reverse(this))
  }
}

export class PeekableRustIterator<T> extends RustIterator<T> {
  peeked: IteratorResult<T> | undefined
  peek(): IteratorResult<T> {
    if (!this.peeked) this.peeked = this.next()
    return this.peeked
  }
  next() {
    if (this.peeked) {
      const peeked = this.peeked
      this.peeked = undefined
      return peeked
    }
    return super.next()
  }
  peekable(): PeekableRustIterator<T> {
    return this
  }
  takeWhilePeek(f: (val: T) => boolean): RustIterator<T> {
    return new RustIterator(takeWhilePeek(this, f))
  }
}
