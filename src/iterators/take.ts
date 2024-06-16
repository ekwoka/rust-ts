export function* take<T>(
  iterable: IterableIterator<T> | Iterable<T>,
  n: number,
) {
  const iter = iterable[Symbol.iterator]()
  while (n--) {
    const next = iter.next()
    if (next.done) return
    yield next.value
  }
}

export function* takeWhile<T>(
  iterable: Iterable<T>,
  predicate: (value: T) => boolean,
) {
  for (const value of iterable) {
    if (!predicate(value)) break
    yield value
  }
}
