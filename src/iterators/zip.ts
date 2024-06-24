export function* zip<T, S>(
  a: Iterable<T>,
  b: Iterable<S>,
): IterableIterator<[T, S]> {
  const aIter = a[Symbol.iterator]()
  const bIter = b[Symbol.iterator]()
  while (true) {
    const aNext = aIter.next()
    const bNext = bIter.next()
    if (aNext.done || bNext.done) break
    yield [aNext.value, bNext.value]
  }
}
