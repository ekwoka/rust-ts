export function* scan<T, A = T, R = T>(
  iter: Iterable<T>,
  fn: (acc: [A], item: T) => R,
  initial: A,
) {
  const acc = [initial] as [A]
  for (const item of iter) {
    yield fn(acc, item)
  }
}
