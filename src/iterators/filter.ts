export function* filter<T>(
  iterable: Iterable<T> | IterableIterator<T>,
  f: (val: T) => boolean,
) {
  for (const x of iterable) if (f(x)) yield x
}
