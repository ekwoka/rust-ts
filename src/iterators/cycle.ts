export const cycle = function* <T>(
  iter: Iterable<T>,
): Generator<T, void, undefined> {
  let done = false
  const buff: T[] = []
  const it = iter[Symbol.iterator]()
  while (true) {
    if (done) yield* buff
    else {
      const { value, done: d } = it.next()
      done = Boolean(d)
      if (done) continue
      buff.push(value)
      yield value
    }
  }
}
