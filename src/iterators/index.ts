/**
 * This is a simple and clean implementation of the `Iter` trait from Rust,
 * named as `RustIterator` to avoid conflicts with the current abstract `Iterator` interface in TypeScript,
 * or the upcoming `Iterator` interface in JavaScript.
 *
 * @module RustIterator
 */
import { RustIterator } from './RustIterator.js'

export { arrayChunks } from './arrayChunks.js'
export { chain } from './chain.js'
export { cycle } from './cycle.js'
export { enumerate } from './enumerate.js'
export { filter } from './filter.js'
export { depth, flat, flatMap } from './flat.js'
export { forEach } from './forEach.js'
export { inspect } from './inspect.js'
export { map } from './map.js'
export { reverse } from './reverse.js'
export { scan } from './scan.js'
export { sort } from './sort.js'
export { stepBy } from './stepBy.js'
export { take, takeWhile } from './take.js'
export { window } from './window.js'
export { zip } from './zip.js'
export { r, range } from './range.js'
export { RustIterator, PeekableRustIterator } from './RustIterator.js'
export { takeWhilePeek } from './Peekable/takeWhilePeek.js'
export default RustIterator
