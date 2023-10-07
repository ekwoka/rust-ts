const lexographicalCompare = <T>(a: T, b: T) => (a > b ? 1 : a < b ? -1 : 0);

export function* sort<T>(
  iter: Iterable<T>,
  compare: (a: T, b: T) => number = lexographicalCompare,
) {
  let next = 0;
  const collection: T[] = [...iter];
  while (collection.length) {
    for (let i = 1; i < collection.length; i++)
      if (compare(collection[next], collection[i]) > 0) next = i;
    yield collection.splice(next, 1)[0];
    next = 0;
  }
}
