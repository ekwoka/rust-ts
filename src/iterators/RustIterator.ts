import { chain } from './chain';
import { filter } from './filter';
import { map } from './map';
import { stepBy } from './stepBy';
import { take } from './take';
import { zip } from './zip';

export class RustIterator<T> implements Iterator<T> {
  private upstream: Iterator<T>;

  constructor(upstream: Iterable<T>) {
    this.upstream = upstream[Symbol.iterator]();
  }

  [Symbol.iterator]() {
    return this;
  }

  done = false;

  next() {
    const next = this.upstream.next();
    this.done = next.done ?? false;
    return next;
  }

  nextChunk(n: number): { value: T[]; done: boolean } {
    const chunk = [];
    for (let i = 0; i < n; i++) {
      const { value, done } = this.next();
      if (done) {
        return { value: chunk, done };
      }
      chunk.push(value);
    }
    return { value: chunk, done: false };
  }

  count(): number {
    let count = 0;
    while (!this.next().done) count++;
    return count;
  }

  last(): T | undefined {
    let last;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { value, done } = this.next();
      if (done) return last;
      last = value;
    }
  }

  advanceBy(n: number): void {
    while (n--) this.next();
  }

  nth(n: number): T | undefined {
    this.advanceBy(n);
    return this.next().value;
  }

  collect(): T[] {
    return [...this];
  }

  map<S>(f: (val: T) => S): RustIterator<S> {
    return new RustIterator(map(this, f));
  }

  filter(f: (val: T) => boolean): RustIterator<T> {
    return new RustIterator(filter(this, f));
  }

  take(n: number): RustIterator<T> {
    return new RustIterator(take(this, n));
  }

  stepBy(n: number): RustIterator<T> {
    return new RustIterator(stepBy(this, n));
  }
  chain(other: Iterable<T>): RustIterator<T> {
    return new RustIterator(chain(this, other));
  }
  zip(other: Iterable<T>): RustIterator<[T, T]> {
    return new RustIterator(zip(this, other));
  }
}
