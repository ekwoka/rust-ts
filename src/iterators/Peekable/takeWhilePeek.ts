import type { PeekableRustIterator } from '../RustIterator.js'

export function* takeWhilePeek<T>(
  peekable: PeekableRustIterator<T>,
  predicate: (value: T) => boolean,
): Generator<T> {
  while (!peekable.peek().done && predicate(peekable.peek().value))
    yield peekable.next().value
}
