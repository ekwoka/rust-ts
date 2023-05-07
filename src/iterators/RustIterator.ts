import { map } from "./map";
import { filter } from "./filter";
import { take } from "./take";

export class RustIterator<T> implements Iterator<T> {
  private upstream: Iterator<T>;

  constructor(upstream: Iterable<T>) {
    this.upstream = upstream[Symbol.iterator]();
  }

  [Symbol.iterator]() {
    return this;
  }

  next() {
    return this.upstream.next();
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
    return new RustIterator(take(this,n));
  }
}
