import { chain } from './chain';
import { enumerate } from './enumerate';
import { filter } from './filter';
import { flat } from './flat';
import { forEach } from './forEach';
import { inspect } from './inspect';
import { map } from './map';
import { scan } from './scan';
import { sort } from './sort';
import { stepBy } from './stepBy';
import { take } from './take';
import { window } from './window';
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

  peekable(): PeekableRustIterator<T> {
    return new PeekableRustIterator(this);
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

  forEach(f: (val: T) => void): void {
    forEach(this, f);
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

  enumerate(): RustIterator<[number, T]> {
    return new RustIterator(enumerate(this));
  }

  inspect(fn: (val: T) => void): RustIterator<T> {
    return new RustIterator(inspect(this, fn));
  }

  scan<A = T>(fn: (acc: A, val: T) => A, initial: A): RustIterator<A> {
    return new RustIterator(scan(this, fn, initial));
  }

  flat() {
    return new RustIterator(flat(this));
  }

  window(n: number): RustIterator<T[]> {
    return new RustIterator(window(this, n));
  }

  fold<A = T>(fn: (acc: A, item: T) => A, initial?: A): A {
    let acc = initial ?? this.next().value;
    for (const item of this) acc = fn(acc, item);
    return acc;
  }

  reduce(fn: (acc: T, item: T) => T, initial?: T): T {
    return this.fold(fn, initial);
  }

  sum() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.reduce((acc: any, item: any) => acc + item);
  }

  all(checker: (item: T) => unknown): boolean {
    return !this.any((item) => !checker(item));
  }

  any(checker: (item: T) => unknown): boolean {
    return this.find(checker) !== null;
  }

  find(checker: (item: T) => unknown): T | null {
    for (const item of this) if (checker(item)) return item;
    return null;
  }

  max(): T | undefined {
    return this.reduce((acc, item) => (item > acc ? item : acc));
  }

  min(): T | undefined {
    return this.reduce((acc, item) => (item < acc ? item : acc));
  }

  sort(compare?: (a: T, b: T) => number) {
    return new RustIterator(sort(this, compare));
  }

  position(checker: (item: T) => boolean): number | null {
    let i = 0;
    for (const item of this) {
      if (checker(item)) return i;
      i++;
    }
    return null;
  }
  findIndex(checker: (item: T) => boolean): number | null {
    return this.position(checker);
  }
}

export class PeekableRustIterator<T> extends RustIterator<T> {
  peeked: IteratorResult<T> | undefined;
  peek(): IteratorResult<T> {
    if (!this.peeked) this.peeked = this.next();
    return this.peeked;
  }
  next() {
    if (this.peeked) {
      const peeked = this.peeked;
      this.peeked = undefined;
      return peeked;
    }
    return super.next();
  }
  peekable(): PeekableRustIterator<T> {
    return this;
  }
}
