export function* scan<T, A = T>(
  iter: Iterable<T>,
  fn: (acc: A, item: T) => A,
  initial: A
) {
  let acc = initial;
  for (const item of iter) {
    acc = fn(acc, item);
    yield acc;
  }
}
