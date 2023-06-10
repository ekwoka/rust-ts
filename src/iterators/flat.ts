export function* flat<T>(iter: Iterable<T | T[]>) {
  for (const item of iter) {
    if (Array.isArray(item)) yield* item;
    else yield item;
  }
}
