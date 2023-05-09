export function* chain<T>(...iterables: Iterable<T>[]): IterableIterator<T> {
  for (const iterable of iterables) yield* iterable;
}
