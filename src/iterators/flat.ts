export function* flat<T, D extends number = 1>(
  iter: Iterable<T>,
  depth?: D,
): Generator<Flatten<T, D>, void, undefined> {
  for (const item of iter) {
    if (Array.isArray(item))
      yield* ((depth ?? 1) > 1 ? flat(item, depth! - 1) : item) as Iterable<
        Flatten<T, D>
      >;
    else yield item as Flatten<T, D>;
  }
}

type Dec = [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

type Flatten<T, D extends number> = D extends 0
  ? T
  : T extends Array<infer U>
  ? Flatten<U, Dec[D]>
  : T;
