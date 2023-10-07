import { RustIterator } from './RustIterator.js';

export function* stepBy<T>(iter: Iterable<T>, n: number) {
  const rIter = new RustIterator(iter);
  while (!rIter.done) {
    const { value, done } = rIter.next();
    if (done) break;
    yield value;
    rIter.advanceBy(n - 1);
  }
}
