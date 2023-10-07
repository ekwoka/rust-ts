export function* zip<T>(
  a: Iterable<T>,
  b: Iterable<T>,
): IterableIterator<[T, T]> {
  const aIter = a[Symbol.iterator]();
  const bIter = b[Symbol.iterator]();
  while (true) {
    const aNext = aIter.next();
    const bNext = bIter.next();
    if (aNext.done || bNext.done) break;
    yield [aNext.value, bNext.value];
  }
}
