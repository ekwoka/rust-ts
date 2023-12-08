import { Dec } from '../types/utils';

export function* flat<T, D extends depth = 1>(
  iter: Iterable<T>,
  depth?: D,
): Generator<Flatten<T, D>, void, undefined> {
  for (const item of iter) {
    if (isIterable(item))
      yield* (
        (depth ?? 1) > 1 ? flat(item, (depth! - 1) as Dec[D]) : item
      ) as Iterable<Flatten<T, D>>;
    else yield item as Flatten<T, D>;
  }
}

export function* flatMap<T, S = T>(
  iter: Iterable<T>,
  mapper: (val: T) => S,
): Generator<Flatten<S, 1>, void, undefined> {
  for (const item of iter) {
    const mapped = mapper(item);
    if (isIterable(mapped)) yield* mapped as Iterable<Flatten<S, 1>>;
    else yield mapped as Flatten<S, 1>;
  }
}

const isIterable = <T>(val: Iterable<T> | unknown): val is Iterable<T> => {
  return typeof val === 'object' && val !== null && Symbol.iterator in val;
};
export type depth = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
type Flatten<T, D extends depth> = D extends 0
  ? T
  : T extends Iterable<infer U>
  ? Flatten<U, Dec[D]>
  : T;
