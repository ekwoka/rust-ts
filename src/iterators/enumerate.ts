export function* enumerate<T>(
  iter: Iterable<T>
): IterableIterator<[number, T]> {
  let i = 0;
  for (const x of iter) yield [i++, x];
}
