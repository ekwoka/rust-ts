export function* inspect<T>(
  iter: Iterable<T>,
  fn: (val: T) => void
): IterableIterator<T> {
  for (const x of iter) {
    fn(x);
    yield x;
  }
}
