/**
 * @module
 * @mergeModuleWith VecDequeue
 */
import { RustIterator } from '../iterators/index.js'

/**
 * A double-ended queue implementation using a growable ring buffer.
 * Allows efficient insertion and removal of elements at both ends.
 * Also available as {@linkcode CircularBuffer} to better express intent
 * when using this data structure primarily as a circular buffer.
 *
 * @template Item - The type of elements stored in the deque
 *
 * @groupDescription Array Properties
 * Properties that mirror those found on the native JavaScript Array class
 *
 * @groupDescription Array Methods
 * Methods that provide functionality equivalent to native JavaScript Array methods
 */
export class VecDequeue<Item> {
  /**
   * Current number of elements in the deque
   *
   * @group Array Properties
   */
  length: number = 0

  /**
   * Internal buffer storing the elements
   */
  buffer: Item[]

  /**
   * Index of the first element
   */
  head: number = 0

  /**
   * Index where the next element will be inserted
   */
  tail: number = 0

  /**
   * Total capacity of the buffer
   */
  size: number = 0

  /**
   * Creates a new VecDequeue instance
   *
   * @param initializer - Either an initial array of elements or the initial capacity
   *
   * @template Item - The type of elements to be stored in the deque
   */
  constructor(initializer: Array<Item> | number = 0) {
    if (typeof initializer === 'number') {
      this.buffer = new Array(initializer)
      this.size = Math.max(1, initializer)
    } else {
      this.buffer = initializer.slice()
      this.size = this.length = initializer.length
      this.tail = 0
    }
  }

  /**
   * Gets the element at the specified index, handling negative indices by wrapping around
   *
   * @param index - Index of the element (can be negative)
   *
   * @group Array Methods
   */
  at(index: number): Item | undefined {
    const idx = (index + this.size) % this.size
    if (idx < 0 || idx > this.length) return undefined
    return this.buffer[(this.head + idx) % this.size]
  }

  /**
   * Gets the element at the specified index
   *
   * @param index - Index of the element
   */
  get(index: number): Item | undefined {
    if (index < 0 || index > this.length) return undefined
    return this.buffer[(this.head + index) % this.size]
  }

  /**
   * Sets the element at the specified index
   *
   * @param index - Index to set
   * @param value - Value to set at the index
   */
  set(index: number, value: Item): void {
    if (index < 0 || index > this.length) return
    this.buffer[(this.head + index) % this.size] = value
  }

  /**
   * Adds an element to the end of the deque
   *
   * @param value - Element to add
   *
   * @group Array Methods
   */
  push(value: Item): void {
    this.grow()
    this.buffer[this.tail] = value
    this.tail = (this.tail + 1) % this.size
    this.length++
  }

  /**
   * Removes and returns the last element from the deque
   *
   * @group Array Methods
   */
  pop(): Item | undefined {
    this.tail = this.tail ? this.tail - 1 : this.size - 1
    const v = this.buffer[this.tail]
    this.buffer[this.tail] = undefined as unknown as Item
    this.length--
    return v
  }

  /**
   * Adds an element to the beginning of the deque
   *
   * @param value - Element to add
   *
   * @group Array Methods
   */
  unshift(value: Item): void {
    this.grow()
    this.head = this.head ? this.head - 1 : this.size - 1
    this.buffer[this.head] = value
    this.length++
  }

  /**
   * Removes and returns the first element from the deque
   *
   * @group Array Methods
   */
  shift(): Item | undefined {
    const v = this.buffer[this.head]
    this.buffer[this.head] = undefined as unknown as Item
    this.head = (this.head + 1) % this.size
    this.length--
    return v
  }

  /**
   * Returns the first element in the deque without removing it
   */
  first(): Item {
    return this.buffer[this.head]
  }

  /**
   * Returns the last element in the deque without removing it
   */
  last(): Item {
    return this.buffer[this.tail ? this.tail - 1 : this.size - 1]
  }

  /**
   * Grows the internal buffer when it reaches capacity
   *
   * @internal
   */
  grow(): void {
    if (this.length < this.size) return
    this.buffer.length *= 2
    const newSpaceStart = this.size
    for (let i = 0; i < this.tail; i++) {
      this.buffer[newSpaceStart + i] = this.buffer[i]
      this.buffer[i] = undefined as unknown as Item
    }
    this.size = this.buffer.length
    this.tail += newSpaceStart
  }

  /**
   * Makes the deque iterable
   *
   * @group Array Methods
   */
  [Symbol.iterator](): Iterator<Item> {
    return circularIterable(this)
  }

  /**
   * Creates a RustIterator for this deque
   */
  toIter(): RustIterator<Item> {
    return new RustIterator(this)
  }

  /**
   * Creates a new VecDequeue from an array or a length with a mapping function
   *
   * @param arr - Source array or object with length property
   * @param functor - Optional function to map indices to values
   *
   * @group Array Methods
   */
  static from<T>(arr: Array<T>): VecDequeue<T>
  static from<T>(
    opt: { length: number },
    functor?: (v: number, i: number) => T,
  ): VecDequeue<T>

  static from<T>(
    optArr: { length: number } | Array<T>,
    functor?: (v: number, i: number) => T,
  ): VecDequeue<T> {
    const buff = Array.isArray(optArr)
      ? optArr
      : Array.from(optArr, (_, i) => functor?.(i, i) ?? (undefined as T))
    return new VecDequeue<T>(buff)
  }
}

/**
 * Creates an iterator for the VecDequeue that yields elements in order
 *
 * @internal
 * @param d - The VecDequeue to iterate over
 */
function* circularIterable<T>(d: VecDequeue<T>): Generator<T> {
  for (let i = 0; i < d.length; i++) {
    yield d.buffer[(d.head + i) % d.size]
  }
}
