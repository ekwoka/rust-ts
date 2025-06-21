/**
 * @module
 * @mergeModuleWith RustIterator
 */

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
 *
 * @template Item - The type of item yielded by the iterator
 *
 * @groupDescription IterableIterator
 * Methods and properties that are part of the IterableIterator interface
 *
 * @groupDescription Consuming
 * Immediately consume all or a portion of the `Iterator` returning a new value
 *
 * All of the methods in this group consume the `Iterator`, partially or in full, performing all upstream work to yield those values. If an `Iterator` infinitely yields values, these can potentially lock the thread entirely.
 *
 * @groupDescription Iterating
 * Return new {@linkcode RustIterator} that will transform the values when consumed, but does not consume the original `Iterator`
 *
 * @groupDescription Special
 * Anything else, mainly methods that will return a new {@linkcode RustIterator} while also consuming the previous `Iterator`
 */
export class RustIterator<Item> implements IterableIterator<Item> {
  private upstream: Iterator<Item>

  /**
   * Constructs a new {@linkcode RustIterator} from an `Iterable`.
   *
   * @remarks
   * This will call the `@@iterator` method on the `Iterable` and store the returned `Iterator` internally. This will not otherwise consume any `Iterator` passed in. If the `Iterable` supplied, is an `Iterator` then consuming the {@linkcode RustIterator} would consume that `Iterator`.
   *
   * Creating a {@linkcode RustIterator} from an upstream {@linkcode RustIterator} will return a new {@linkcode RustIterator} that wraps the previous, not simply the same {@linkcode RustIterator}. It will not clone the values, or any other magic.
   *
   * @param upstream - Any `Iterable` that will be used as the source values for the iterator.
   *
   * @template Item - The type of item yielded by the iterator
   */
  constructor(upstream: Iterable<Item>) {
    this.upstream = upstream[Symbol.iterator]()
  }

  /**
   * Returns itself, as an `Iterator`.
   * This allows for {@linkcode RustIterator} to be used in for-of loops, and be spread easily.
   *
   * @remarks
   * This method, called with the well-known `Symbol` `@@iterator` is used internally when doing `Array` destructuring, spreading, or `for..of` looping over `Iterable` objects. This is all that is needed to implement the `Iterable` abstract interface.
   *
   * In this case, the method simply returns the same `RustIterator` instance it is called on, not a distinct object.
   *
   * @group IterableIterator
   */
  [Symbol.iterator](): RustIterator<Item> {
    return this
  }

  /**
   * To implement the Extended Iterable. Returns Self (to be IterableIterator).
   * This allows for RustIterator to be used in for-of loops, and be spread easily.
   */
  iter() {
    return this
  }

  /**
   * Whether this iterator is capable of yielding new values.
   *
   * @remarks
   * This does not consume any part of the `Iterator`, and as such does not actually KNOW if the `Iterator` is done, just indicates if the `Iterator` has previously completed. This means an `Iterator` with a `done` value of `false` may or may not actually have an additional value, but a `done` of `true` means the `Iterator` should not yield any new values.
   *
   * `Iterator` instances that were previously `done` can still yield new values (and mark themselves as not `done`) in the future, on a technical level. {@linkcode RustIterator} instances will generally never actually do this, as nearly every method will return a fused iterator that will never again yield a new value.
   *
   * @group IterableIterator
   */
  done = false

  /**
   * Returns the next yielded value from the iterator as an `IteratorResult<Item>`. This consumes one value of the upstream `Iterator`
   *
   * @group IterableIterator
   */
  next(): IteratorResult<Item> {
    const next = this.upstream.next()
    this.done = next.done ?? false
    return next
  }

  /**
   * Turn this iterator into a peekable iterator.
   * A Peekable Iterator allows you to peek at the next value without consuming it.
   * @returns {PeekableRustIterator<Item>}
   */
  peekable(): PeekableRustIterator<Item> {
    return new PeekableRustIterator(this)
  }

  /**
   * Returns the next `n` values yielded by the `Iterator` as an array.
   *
   * @remarks
   * If the `Iterator` becomes `done` before yielding `n` values, the returned array will contain all of the yielded values and the `done` property will be set to `true`.
   *
   * @param n - The number of items to yield
   *
   * @group Consuming
   */
  nextChunk(n: number): { value: Item[]; done: boolean } {
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

  /**
   * Counts the items yielded by the `Iterator`.
   *
   * @group Consuming
   */
  count(): number {
    let count = 0
    while (!this.next().done) count++
    return count
  }

  /**
   * Returns the final value yielded by the `Iterator`.
   *
   * If the `Iterator` is already `done` or never yields a value before becoming `done`, returns `undefined`.
   *
   * @group Consuming
   */
  last(): Item | undefined {
    let last
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { value, done } = this.next()
      if (done) return last
      last = value
    }
  }

  /**
   * Advances the `Iterator` {@linkcode n}` steps consuming those values.
   *
   * @param n - the amount of values to skip
   *
   * @group Consuming
   */
  advanceBy(n: number): this {
    while (n--) this.next()
    return this
  }

  /**
   * Returns the `nth` value yielded by the `Iterator`.
   *
   * If the `Iterator` becomes `done` before `n` values, returns `undefined`
   *
   * @param n - the 0-index of the value to return
   *
   * @group Consuming
   */
  nth(n: number): Item | undefined {
    this.advanceBy(n)
    return this.next().value
  }

  /**
   * Collect all the values from the `iterator` into an array.
   *
   * @remarks
   * Probably the most important `Consuming` method, {@linkcode collect} consumes the `Iterator` and places all of the values into an `Array`.
   *
   * Very useful for passing the values out to things that need `Array` or storing an intermediary collection of the values, to allow multiple iterations.
   *
   * @group Consuming
   */
  collect(): Item[] {
    return [...this]
  }

  /**
   * Collect all the values from the `iterator` into a new `Map`, when {@linkcode Item} is a Key-Value Tuple.
   *
   * @template K - The key type
   *
   * @template V - The value type
   *
   * @group Consuming
   *
   * @remarks
   * Trying to pass `Map` to `into` when the Iterator type is not a `[K, V]` tuple will result in a type error.
   */
  into<K, V>(
    this: RustIterator<[K, V] | readonly [K, V]>,
    container: typeof Map,
  ): Map<K, V>
  /**
   * Collect all the values from the `iterator` into a new `Set`.
   *
   * @group Consuming
   */
  into(this: RustIterator<Item>, container: typeof Set): Set<Item>
  /**
   * @group Consuming
   */
  into(container: typeof Set | typeof Map) {
    /** @ts-expect-error - Doesn't like differing Map and Set signatures */
    return new container(this)
  }

  /**
   * Will yield tuples of size length of values from the Iterator.
   *
   * @param size - The number of values to yield in a tuple array.
   *
   * @remarks
   *
   * If the end of the Iterator is reached and the internal chunk is not yet size length, the chunk is yielded as is.
   * The missing values will be undefined.
   *
   * @group Iterating
   */
  arrayChunks<N extends number>(size: N) {
    return new RustIterator(arrayChunks<Item, N>(this, size))
  }

  /**
   * Will yield the result of passing each value through {@linkcode functor}.
   *
   * @see `Array.map`
   *
   * @param functor - Function to pass all yielded values through
   *
   * @group Iterating
   */
  map<S>(functor: (val: Item) => S): RustIterator<S> {
    return new RustIterator(map(this, functor))
  }

  /**
   * Will yield only those items for which the {@linkcode predicate} returns `true`.
   *
   * @see `Array.filter`
   *
   * @param predicate - Function to check each value with
   *
   * @group Iterating
   */
  filter(predicate: (val: Item) => boolean): RustIterator<Item> {
    return new RustIterator(filter(this, predicate))
  }

  /**
   * Consumes the `Iterator`, calling {@linkcode functor} with each value.
   *
   * @param functor - a function that will be called with each value of the `Iterator`
   *
   * @see Array.forEach
   *
   * @group Consuming
   */
  forEach(functor: (item: Item) => void): void {
    forEach(this, functor)
  }

  /**
   * Will yield only the first `n` values
   *
   * @remarks
   * If the upstream iterator yields less than `n` items, then all of them will be yielded and the iterator will be fused.
   *
   * @param n - The maximum number of items to yield
   *
   * @group Iterating
   */
  take(n: number): RustIterator<Item> {
    return new RustIterator(take(this, n))
  }

  /**
   * Will yield items only until an item fails the {@linkcode predicate}.
   *
   * @remarks
   * If the upstream iterator yields only items that pass the predicate, then all items will be yeilded and the iterator fused.
   *
   * Will not yield the first value that returns falsy, but it will consume that value from the upstream Iterator.
   *
   * @param predicate - The function to check values with.
   *
   * @group Iterating
   */
  takeWhile(predicate: (item: Item) => boolean): RustIterator<Item> {
    return new RustIterator(takeWhile(this, predicate))
  }

  /**
   * Will yield only ever nth value from the upstream Iterator.
   *
   * @param n - number indicating that the iterator should yeild every `nth` Item
   *
   * @group Iterating
   */
  stepBy(n: number): RustIterator<Item> {
    return new RustIterator(stepBy(this, n))
  }

  /**
   * Individually yields all the values of {@linkcode other} AFTER consuming all of the upstream `Iterator`.
   * @param other - Iterable to yield after the current
   *
   * @group Special
   */
  chain(other: Iterable<Item>): RustIterator<Item> {
    return new RustIterator(chain(this, other))
  }

  /**
   * Successively yields a tuple of the next values of both the upstream `Iterator` and `other`.
   *
   * @remarks
   * This is useful for merging values together as pairs automatically.
   *
   * If the Iterables are not of the same length, values will be yielded until the shortest Iterable is consumed.
   *
   * @param other - Iterable to zip with the current
   *
   * @group Special
   */
  zip<Other = Item>(other: Iterable<Other>): RustIterator<[Item, Other]> {
    return new RustIterator(zip(this, other))
  }

  /**
   * Will yield tuples of the 0-index and the value.
   *
   * @remarks
   * This is useful for having access to the index like is available in the Array methods
   *
   * @group Iterating
   */
  enumerate(): RustIterator<[number, Item]> {
    return new RustIterator(enumerate(this))
  }

  /**
   * Yields every value as is, but first passes the value to fn.
   *
   * @remarks
   * This allows accessing the value, primarily for debugging purposes, expressively in the method chain.
   *
   * The most simple use is with console.log
   *
   * Function will only be called when the iterator is consumed.
   *
   * @param fn - A function that will be called with each value of the `Iterator`
   *
   * @example
   * iter.inspect(console.log)
   *     .filter(Boolean)
   *     .inspect(console.log)
   *     .collect();
   *
   * @group Iterating
   */
  inspect(fn: (val: Item) => void): RustIterator<Item> {
    return new RustIterator(inspect(this, fn))
  }

  /**
   * Yields the result of passing the value to fn.
   *
   * {@linkcode functor} is also passed a tuple of initial as the starting state, and continues to pass that same state as an argument to each calling of fn.
   *
   * @remarks
   * When you mutate state, this allows you to iterate while maintaining some kind of internal "memory" to the iteration, so it can have some sense of the past.
   *
   * @param functor - Functor to which each value will be passed
   * @param initial - An initial value for the internal state
   *
   * @group Iterating
   */
  scan<State = Item, Return = Item>(
    functor: (state: [State], val: Item) => Return,
    initial: State,
  ): RustIterator<Return> {
    return new RustIterator(scan(this, functor, initial))
  }

  /**
   * Yields the individual values yielded by flattening the value (where T = Iterable) depth number of times.
   *
   * @see `Array.flat`
   *
   * @remarks
   * This can allow multiple Iterable to be combined, to iteratively iterate over each successive Iterable.
   *
   * For this purpose, only Iterable objects will be flattened. string, while Iterable, will not be flattened into individual characters or codepoint.
   *
   * @param depth - The number of times to flatten the `Iterable`
   *
   * @group Iterating
   */
  flat<D extends depth = 1>(depth?: D) {
    return new RustIterator(flat<Item, D>(this, depth))
  }

  /**
   * Yields the individual items yielded by flattening the result of calling mapper with the value. This will only flatten a single level.
   *
   * @see `Array.flatMap`
   * This is similar to separately calling `.map.flat` with a depth of 1.
   *
   * For this purpose, only Iterable objects will be flattened. string, while Iterable, will not be flattened into individual characters or codepoint
   *
   * @param functor - A function that will be called with each item of the `Iterator`, returning an `Iterable`
   *
   * @group Iterating
   */
  flatMap<S>(functor: (item: Item) => S) {
    return new RustIterator(flatMap(this, functor))
  }

  /**
   * Yields tuples of n size containing a rolling window of values.
   * Each subsequent yielded value will be the same as the previous, except with the head value removed, and a new value added at the tail.
   *
   * @remarks
   * No window will be yielded until n values are consumed, even if the Iterator becomes done before then.
   *
   *  Similarly, once the Iterator is done, no more values will be yielded. This means each window yielded will be `n` size, each time, every time.
   *
   * @param n - The size of the window
   *
   * @group Iterating
   */
  window<Size extends number>(n: Size) {
    return new RustIterator(window<Item, Size>(this, n))
  }

  /**
   * Repeatedly yields each individual value of the upstream `Iterator` forever, resulting in an `Iterator` that can never be `done`.
   *
   * @remarks
   *  As this requires storing all yielded values in memory, for large datasets, this means a lot of memory.
   *
   * As the returned `Iterator` can NEVER end, `Consuming` methods could result in a blocked thread, if there have not been additional methods that limit the length of the `Iterator` (like {@linkcode take}, {@linkcode takeWhile}, {@linkcode find}) that will eventually fuse the `Iterator`.
   *
   * @group Special
   */
  cycle(): RustIterator<Item> {
    return new RustIterator(cycle(this))
  }

  /**
   * Consumes the `Iterator`, calling {@linkcode functor} with each value and the {@linkcode initial} as an accumulator. The returned value from each {@linkcode functor} call, is passed as the `acc`.

   * @template Acc - The type of the accumulator
   *
   * @param functor - A function that will be called with the accumulator and each value of the `Iterator`, returning the updated accumulator
   *
   * @param initial - Initial value of the accumulator
   *
   * @see Array.reduce
   *
   * @remarks
   * If no `initial` is passed, the very first item yielded by the `Iterator` is used as the accumulator, with the first call of `fn` being passed both the first and second yielded values.
   *
   * This is the generalized form of {@linkcode reduce} that allows {@linkcode Acc} to be different from {@linkcode Item}.
   *
   * @group Consuming
   */
  fold<Acc = Item>(functor: (acc: Acc, item: Item) => Acc, initial?: Acc): Acc {
    let acc = initial ?? this.next().value
    for (const item of this) acc = functor(acc, item)
    return acc
  }

  /**
   * Consumes the `Iterator`, calling {@linkcode functor} with each value and the provided {@linkcode initial} as an accumulator. If no {@linkcode initial} is provided, the first value will be used as the accumulator.
   *
   * @param functor - A function that will be called with the accumulator and each value of the `Iterator`, returning the updated accumulator
   *
   * @param initial - Initial value of the accumulator
   *
   * @see Array.reduce
   *
   * @remarks
   * Similar to {@linkcode fold} but requires `acc` be the same type as {@linkcode Item}
   *
   * Internally uses {@linkcode fold}
   *
   * @group Consuming
   */
  reduce(functor: (acc: Item, item: Item) => Item, initial?: Item): Item {
    return this.fold(functor, initial)
  }

  /**
   * Consumes the `Iterator`, adding the values together (with the `+` operator), returning the final value (a summed `number`)
   *
   * @remarks
   * This will only have predictable results on `string`, `number` and `bigint` type `Iterator`. Other primitives and objects can have unpredictable and not type safe results.
   *
   * @see {@linkcode reduce}
   *
   * @group Consuming
   */
  sum<T extends number>(this: RustIterator<T>): number
  /**
   * Consumes the `Iterator`, adding the values together (with the `+` operator), returning the final value (a concatenated `string`)
   *
   * @group Consuming
   */
  sum<T extends string>(this: RustIterator<T>): string
  /**
   * Consumes the `Iterator`, adding the values together (with the `+` operator), returning the final value (a summed `bigint`)
   *
   * @group Consuming
   */
  sum<T extends bigint>(this: RustIterator<T>): bigint
  sum<T extends number | string | bigint>(this: RustIterator<T>) {
    // biome-ignore lint/suspicious/noExplicitAny: Needs Any to support multiple generics
    return this.reduce((acc: any, item: any) => acc + item)
  }

  /**
   * Returns `true` if *all* yielded value returns `true` when passed to the {@linkcode predicate}, otherwise `false`.
   *
   * @see Array.Some
   * @see {@linkcode find}
   * @param predicate - A function that will be called with each value of the `Iterator`, returning a boolean
   *
   * @remarks
   * Will return `false` if the `Iterator` yields no values
   *
   * Internally, this uses {@linkcode find}
   *
   * @group Consuming
   */
  all(predicate: (item: Item) => unknown): boolean {
    return !this.any((item) => !predicate(item))
  }

  /**
   * Returns `true` if *any* yielded value returns `true` when passed to the {@linkcode predicate}, otherwise `false`.
   *
   * @see Array.Some
   * @see {@linkcode find}
   * @param predicate - A function that will be called with each value of the `Iterator`, returning a boolean
   *
   * @remarks
   * Will return `true` if the `Iterator` yields no values
   *
   * Internally, this uses {@linkcode find}
   *
   * @group Consuming
   */
  any(predicate: (item: Item) => unknown): boolean {
    return this.find(predicate) !== null
  }

  /**
   * Calls the {@linkcode predicate} with each yielded value, returning the first value that results in a `truthy` value. Returns `null` if no such value is found.
   *
   * @param predicate - A function that will be called with each value of the `Iterator`, returning a boolean
   *
   * @remarks
   * The `Iterator` is only consumed up until the first match. Any remaining values could still be yielded. Calling `find` multiple times could be used like `filter` in cases where the filtering condition may change as the `Iterator` is iterated.
   *
   * @group Consuming
   */
  find(predicate: (item: Item) => unknown): Item | null {
    for (const item of this) if (predicate(item)) return item
    return null
  }

  /**
   * Returns the maximum value (with the `>` operator) yielded by the `Iterator`.
   *
   * @remarks
   * This will only have predictable results on `string`, `number` and `bigint` type `Iterator`. Other primitives and objects can have unpredictable and not type safe results.
   *
   * `string` values will be sorted by the first `codepoint` that differs between two `string` values, with later `codepoint` being returned. Characters that are made of multiple `codepoint` are treated as two separate `codepoint`. This mainly applies to non-English texts and Emojis.
   *
   * @see {@linkcode reduce}
   *
   * @group Consuming
   */
  max(): Item | undefined {
    return this.reduce((acc, item) => (item > acc ? item : acc))
  }

  /**
   * Returns the maximum value (with the `>` operator) yielded by the `Iterator`.
   *
   * @remarks
   * This will only have predictable results on `string`, `number` and `bigint` type `Iterator`. Other primitives and objects can have unpredictable and not type safe results.
   *
   * `string` values will be sorted by the first `codepoint` that differs between two `string` values, with earlier `codepoint` being returned. Characters that are made of multiple `codepoint` are treated as two separate `codepoint`. This mainly applies to non-English texts and Emojis.
   *
   * @see {@linkcode reduce}
   *
   * @group Consuming
   */
  min(): Item | undefined {
    return this.reduce((acc, item) => (item < acc ? item : acc))
  }

  /**
   * Yields each value of the upstream `Iterator`, after sorting the values through `compare`.
   *
   * @see `Array.sort`
   *
   * @remarks
   * By default this uses a `lexigraphicCompare` sort when no {@linkcode comparator} is passed. This emulates the native behavior of `Array.sort`, although mixed arrays of `number | string` can have strange results, as this will not turn all `number` to `string` when sorting.
   *
   * It is recommended to provide your own `compare` any time you have values that are not strictly `number | bigint`.
   *
   * To accomplish sorting, the upstream `Iterator` is completely consumed and stored in memory, immediately upon calling this method, even if the returned {@linkcode RustIterator} has not yielded any values.
   *
   * To reduce the total work performed, and iteratively sort the values, a Bubble Sort algorithm is used.
   *
   * When the resulting `Iterator` yields a value, the first value bubbles through being compared to each remaining value, being swapped as needed. When this process is done, the value is yielded.
   *
   * As values are yielded, the internal storage of values is reduced in memory.
   *
   * While Bubble Sort can increase total comparisons when needing to sort the entire list, it works nicely for this use case, as it doesn't prematurely sort any sub arrays while producing the next value.
   * This is ideal for the purpose of an `Iterator` where you do as little work as possible until it is finally needed, and where not all values will actually need to be sorted, as in the example.
   *
   * @example
   * ```ts
   * const lowestThreePrices = prices
   *    .sort()
   *    .take(3)
   *    .collect();
   * ```
   *
   * While this will `collect` all of the `prices`, it will only sort out the lowest three values, discarding the remaining unsorted values.
   *
   * @remarks
   * Due to the naive nature of the sorting implementation, this sort is NOT stable, ie. the order of like values (those that when compared with `compare` return `0`) is not preserved from the original order.
   *
   * In fact, they will almost always be reversed. Maybe that's something to fix....in the future...
   *
   * @param comparator - functor to compare two values
   *
   * @group Special
   */
  sort(comparator?: (a: Item, b: Item) => number) {
    return new RustIterator(sort(this, comparator))
  }

  /**
   * Returns the 0-index of the first yielded value that returns `true` when passed to the {@linkcode predicate}.
   *
   * Returns `null` when no yielded values match
   *
   * @see `Array.findIndex`, except that it will not return `-1` on no match
   *
   * @param predicate - A function that will be called with each value of the `Iterator`, returning a boolean
   *
   * @group Consuming
   */
  position(predicate: (item: Item) => boolean): number | null {
    let i = 0
    for (const item of this) {
      if (predicate(item)) return i
      i++
    }
    return null
  }
  /**
   * Alias for {@linkcode position}
   *
   * @group Consuming
   */
  findIndex(predicate: (item: Item) => boolean): number | null {
    return this.position(predicate)
  }

  /**
   *
   * Individually yields all the values of the upstream `Iterator` in reverse order.
   *
   * @see `Array.reverse`
   *
   * @remarks To accomplish this, the upstream `Iterator` is completely consumed and stored in memory, immediately upon calling this method, even if the returned {@linkcode RustIterator} has not yet yielded any values.
   *
   * The values in memory are not stored in reverse order, instead the values are yielded from the tail to the head.
   *
   * @group Special
   */
  reverse() {
    return new RustIterator(reverse(this))
  }
}

export class PeekableRustIterator<Item> extends RustIterator<Item> {
  /**
   * If the `Iterator` is currently in the state of having been `peeked` at ({@linkcode peek} has been called since the last time {@linkcode next} was called), this will return that `IteratorResult`, otherwise `undefined`.
   *
   * @remarks
   * This is primarily internal for handling the `peeked` value.
   */
  peeked: IteratorResult<Item> | undefined

  /**
   * Returns the `IteratorResult` that will next be yielded when calling {@linkcode next}. This can allow the developer to check the next value, and change course, without consuming the value in the `Iterator`.
   *
   * @remarks
   * Due to how `Iterator` work, this WILL consume the next value from the upstream `Iterator` as that value will need to be consumed to inspect it.
   *
   * If you split iterators out and consume them in different places strategically, this will block that value from being able to be yielded by other consumers of that `Iterator`.
   *
   * That value is stored internally and will be returned the next time `next` is called.
   */
  peek(): IteratorResult<Item> {
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

  peekable(): PeekableRustIterator<Item> {
    return this
  }

  /**
   * Will yield values until the predicate returns `false`, but will do so while peeking at the next value.
   *
   * @remarks
   * This differs from {@linkcode takeWhile} in that the first value to return false from the `predicate` will still be available on this iterator
   *
   * @see {@linkcode takeWhile}
   *
   * @group Iterating
   */
  takeWhilePeek(predicate: (val: Item) => boolean): RustIterator<Item> {
    return new RustIterator(takeWhilePeek(this, predicate))
  }
}
